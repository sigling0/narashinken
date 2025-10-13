<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', '658my_75tj6v4n' );

/** Database username */
define( 'DB_USER', '658my_a8r5xy8t' );

/** Database password */
define( 'DB_PASSWORD', 'E6*334646y7' );

/** Database hostname */
define( 'DB_HOST', 'mysql1013.onamae.ne.jp' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'ru#@Srxd2xjMz@qiX%5uU_Ef/GhM12AH G}j~uqVlTs%Hs_V59eXQ$u1MbhuW}EX' );
define( 'SECURE_AUTH_KEY',   '.hIxs=Kj=L65BH)n<wh;lKE<ftd^ZWqn7BiJ-x%1{V(^2?;l_840KezT%Sj)^_-c' );
define( 'LOGGED_IN_KEY',     ',p9Hm)vvNw3Y3  _%l/ &mD)`t;G6|=T+>V6lLom?w23Q=W]_6#AcO.z~eX?uky-' );
define( 'NONCE_KEY',         '8yG0]o{:qFtWrc:=:|$/VsXOs!Cn}G/11ai+4_k[GI+)Mi4r=)jF<z.%ZF%sh+]T' );
define( 'AUTH_SALT',         '41yY`Ei-7]|>a>,&bnsu.bo*Km6(o(~$8a_,HP!t|+|%RI,glx{NlbtD(!ELwC+A' );
define( 'SECURE_AUTH_SALT',  'OHWrM)MG}qlI0$R<A/Nb[HUzS)fDIX_u)^@Ye~:{!s(+lF_Pj0|s14?u78Wu5LU>' );
define( 'LOGGED_IN_SALT',    'Zv;?Uc~TL?VNr.fSTxHYo:3*ptA-uUv-M=Q&Jgx7xOY=Jn myrpN40oo)lRz%*wR' );
define( 'NONCE_SALT',        '0bghO~li<pHJ}N8gk}6}NVS1rEFSbsXA%iIPNbfs9!#dlX7rI 5vtF;t2cCi%Cf^' );
define( 'WP_CACHE_KEY_SALT', 'wdHiN/eQm%NUL;AS9l&d8VdxyW)Js09itAf-Yh8lvCd-dPdY6.X=AEj+.IY^ kWb' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === "https") {
    $_SERVER['HTTPS'] = 'on';
    define('FORCE_SSL_LOGIN', true);
    define('FORCE_SSL_ADMIN', true);
}


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'RS_DASHBOARD_PLUGIN_SID', '3PxNE3F8Y8i4Z7SNoIAGmr-D1LqNzhVecjnhF9MBXKAuih0W89uFN4siTxczq_YGrwOh-X5e60f_AgBXp46H9nWw7Sjzbwecxgt-Xw___ng.' );
define( 'RS_DASHBOARD_PLUGIN_DID', 'hH3dbynLIQRm8tH6kMvmORvFH-x1YfwD-Hhi5IjQeudJ6Fa2D59AdLUUt3YB0T4qxUD52eBv_XC_75I8a8q_JCEEvob3V9rCKOqNA5ZBljo.' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
