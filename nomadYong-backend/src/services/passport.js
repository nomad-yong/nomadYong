const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy  = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('config');
const User = require('models/user');

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // if user doesn't exists, handle it
    if(!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));

// FACEBOOK OAUTH STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: config.oauth.facebook.clientID,
  clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('profile', profile);
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);

    const existingUser = await User.findOne({ "uid": profile.id });
    if(existingUser) {
      return done(null, existingUser);
    }

    const newUser = new User({
        email: profile.emails[0].value,
        userName: profile.displayName,
        profile_image: profile.photos[0].value,
        provier: 'FACEBOOK',
        uid: profile.id,
    });

    await newUser.save();
    done(null, newUser);
  } catch(error) {
    done(error, false, error.message);
  }
}));

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: config.oauth.google.clientID,
  clientScret: config.oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);

    // Check whether this current user exists in our DB
    const existingUser = await User.findOne({ "uid": profile.id});
    if(existingUser) {
      return done(null, existingUser);
    }

    // If new account
    const newUser = new User({
        email: profile.emails[0].value,
        userName: profile.displayName,
        profile_image: profile.photos[0].value,
        provider: 'GOOGLE',
        uid: profile.id,
    });

    await newUser.save();
    done(null, newUser);

  } catch (error) {
    done(error, false, error.message);
  }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ "email": email });

    // If not, handle it
    if(!user) {
      return done(null, false);
    }

    // check if the password is correct
    const isMatch = await user.isValidPassword(password);

    // If not, handle it
    if(!isMatch) {
      return done(null, false);
    }

    // Otherwist, return the user
    done(null, user);
    } catch (error) {
      done(error, false);
    }
}));

module.exports = {
   passportSignIn: passport.authenticate('local', {session: false }),
   passportJWT: passport.authenticate('jwt', { session: false }),
   passportGoogle: passport.authenticate('googleToken', { session: false }),
   passportFacebook: passport.authenticate('facebookToken', { session : false }),
}
