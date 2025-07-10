


// // // passport.js
// // // passport.js (ESM version)
// // // passport.js
// // import passport from 'passport';
// // import { Strategy as LocalStrategy } from 'passport-local';
// // import bcrypt from 'bcrypt';
// // import { pool } from './db.js'; // named import

// // passport.use(new LocalStrategy(
// //   { usernameField: 'email' },
// //   async (email, password, done) => {
// //     try {
// //       const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
// //       if (!rows.length) {
// //         return done(null, false, { message: 'Incorrect email.' });
// //       }

// //       const user = rows[0];
// //       const match = await bcrypt.compare(password, user.password);
// //       if (!match) {
// //         return done(null, false, { message: 'Incorrect password.' });
// //       }

// //       return done(null, user);
// //     } catch (err) {
// //       return done(err);
// //     }
// //   }
// // ));

// // passport.serializeUser((user, done) => {
// //   done(null, user.id);
// // });

// // passport.deserializeUser(async (id, done) => {
// //   try {
// //     const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
// //     if (!rows.length) {
// //       return done(new Error('User not found'));
// //     }
// //     done(null, rows[0]);
// //   } catch (err) {
// //     done(err);
// //   }
// // });

// // export default passport;



// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import bcrypt from 'bcrypt';
// import { pool } from './db.js';

// passport.use(new LocalStrategy(
//   { usernameField: 'email' },
//   async (email, password, done) => {
//     try {
//       const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
//       if (!rows.length) {
//         return done(null, false, { message: 'Incorrect email.' });
//       }

//       const user = rows[0];

//       // Optional: check if user email is verified here (could also be done in login route)
//       // if (!user.email_verified) {
//       //   return done(null, false, { message: 'Email not verified.' });
//       // }

//       const match = await bcrypt.compare(password, user.password);
//       if (!match) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
//     if (!rows.length) {
//       return done(new Error('User not found'));
//     }
//     done(null, rows[0]);
//   } catch (err) {
//     done(err);
//   }
// });

// export default passport;



import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from './db.js';

passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists in database
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE google_id = $1', 
        [profile.id]
      );
      
      if (rows.length > 0) {
        return done(null, rows[0]);
      }
      
      // Create new user if doesn't exist
      const newUser = {
        google_id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        type: 'Household' // Default type, can be changed later
      };

      const result = await pool.query(
        `INSERT INTO users (google_id, name, email, type, isVerified) 
         VALUES ($1, $2, $3, $4, true)
         RETURNING *`,
        [newUser.google_id, newUser.name, newUser.email, newUser.type]
      );

      done(null, result.rows[0]);
    } catch (err) {
      done(err);
    }
  }
));

// Keep existing serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!rows.length) return done(new Error('User not found'));
    done(null, rows[0]);
  } catch (err) {
    done(err);
  }
});