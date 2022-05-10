const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require('bcryptjs')
const User = require('./models/user.model');
const passport = require("passport");

const GOOGLE_CLIENT_ID =
    "583074503117-nncrkkov20v8i1b97auu48jgm6r1ogkn.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

GITHUB_CLIENT_ID = "your id";
GITHUB_CLIENT_SECRET = "your id";

FACEBOOK_APP_ID = "your id";
FACEBOOK_APP_SECRET = "your id";

passport.use(
    new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async function(accessToken, refreshToken, profile, done) {
            //can get everything
            const userme = null;
            const emailcreate = profile.name.givenName +
                profile.name.familyName + "@hotmail.com";
            const check_please = await User.exists({ 'email': emailcreate })
                //first time created
            if (!check_please) {
                try {
                    const genreateVerifyNUmbers = () => {
                        var arr = [];
                        while (arr.length < 5) {
                            var r = Math.floor(Math.random() * 10) + 1;
                            if (arr.indexOf(r) === -1) arr.push(r);
                        }
                        return arr;
                    }
                    var arr4 = genreateVerifyNUmbers();
                    const newPassword = await bcrypt.hash("219120831" + profile.displayName, 6)
                    userme = await User.create({
                        name: profile.displayName,
                        email: emailcreate,
                        password: newPassword,
                        photo: profile.photos[0].value,
                        source: "google",
                        VFirstTime: arr4.join(''),
                        FirstTimeUsed: 'false',
                    })
                    console.log("there no user")
                } catch (err) {
                    console.log(err)
                }
            }
            done(null, profile);
        }
    )
);

passport.use(
    new GithubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "/auth/github/callback",
        },
        function(accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    )
);

passport.use(
    new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: "/auth/facebook/callback",
        },
        function(accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});