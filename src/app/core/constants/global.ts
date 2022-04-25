import {environment} from '@env';
import * as moment from 'moment';
import {StripeCardElementOptions} from '@stripe/stripe-js';


export const API_URL = environment.apiUrl;
export const SOCKET_URL = environment.socketUrl;
export const VIDEO_DEFAULT_THUMBNAILS_PATH = 'assets/img/video-thumbnail-default.png';
export const VIDEO_DEFAULT_COVERS_PATH = 'assets/img/default-thumbnail.png';
export const VIDEO_DEFAULT_AVATARS_PATH = 'assets/img/default-user.png';
export const USER_DEFAULT_AVATARS_PATH = 'assets/img/default-user.png';
export const GROUP_DEFAULT_AVATARS_PATH = 'assets/img/default-group-people-icon_light.jpg';
export const DEFAULT_VIDEO_SUGGESTIONS_COUNT = 5;
export const MAX_CARDS_PER_USER = 3;

export const PROFILE_PAGE_TABS = [
    {name: 'Watchlist', link: 'watchlist', ownPageOnly: false},
    {name: 'Connections', link: 'connections', ownPageOnly: false},
    {name: 'Connection requests', link: 'requests', ownPageOnly: true},
    {name: 'Cards', link: 'cards', ownPageOnly: true},
];


export const CHANNEL_PAGE_TABS = [
    {name: 'Watchlist', link: 'watchlist'},
    {name: 'Videos', link: 'videos'},
    {name: 'Playlists', link: 'playlists'},
    {name: 'Contacts', link: 'contacts'},
    {name: 'About', link: 'about'},
];

export const GROUP_PAGE_TABS = [
    {name: 'About', link: 'about'},
    {name: 'Posts', link: 'posts'},
    {name: 'People', link: 'people'},
    {name: 'Media', link: 'media'},
];

export const NAVBAR_ADDITIONAL_LINKS = [
    {name: 'Accessibility assessment', link: 'accessibility-assessment'},
    {name: 'About Metl', link: 'about-us'},
    {name: 'Contact us', link: 'contact-us'},
    {name: 'Help', link: 'help'},
    {name: 'METL.TV security', link: 'security'},
    {name: 'Privacy policy', link: 'privacy-policy'},
    {name: 'Cookie policy', link: 'cookie-policy'},
    {name: 'Metl Pro', link: 'turbo-plan'}
];

export const VIDEO_CATEGORIES = ['Stock', 'Etf', 'Cryptocurrency'];

export const ALLOWED_IMG_MIME_TYPES = ['image/jpeg', 'image/png'];

export const PASSWORD_MAX_LENGTH = 15;
export const PASSWORD_MIN_LENGTH = 6;

export const DEVICES_ICONS = [
    {
        name: 'webcam', messages: [
            {type: 'error', msg: 'Can\'t find camera. Make sure it\'s connected and try again', icon: 'videocam_off'},
            {type: 'success', msg: 'Camera is connected', icon: 'checked'}
        ]
    },
    {
        name: 'microphone', messages: [
            {type: 'error', msg: 'Can\'t find microphone. Make sure it\'s connected and try again', icon: 'mic_off'},
            {type: 'success', msg: 'Microphone is connected', icon: 'checked'}
        ]
    }
]


export const VIDEO_FILTERS = [
    {
        group: {name: 'Upload Date', value: 'date'}, items: [
            {name: 'Last hour', value: moment().utc().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss')},
            {name: 'Today', value: moment().startOf('day').format('YYYY-MM-DD')},
            {name: 'This week', value: moment().startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss')},
            {name: 'This month', value: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')},
            {name: 'This year', value: moment().startOf('year').format('YYYY-MM-DD HH:mm:ss')},
        ]
    },

    {
        group: {name: 'Duration', value: 'duration'}, items: [
            {name: 'Clipz (<= 30 seconds)', value: 'short'},
            {name: 'Long (>30 seconds and <1 hour)', value: 'long'},
        ]
    },
    {
        group: {name: 'Category', value: 'category'}, items: [
            {name: 'All', value: 'all'},
            {name: 'Stock', value: 'stocks'},
            {name: 'ETF', value: 'etf'},
            {name: 'Forex', value: 'forex'},
            {name: 'Crypto', value: 'crypto'},
        ]
    }

];

export const STOCK_CATEGORIES = [
    {name: 'Stocks', value: 'stocks'},
    {name: 'ETF', value: 'etf'},
    {name: 'Forex', value: 'forex'},
    {name: 'Cryptocurrency', value: 'crypto'},
];

export const DESCRIPTION_CHARACTERS_LIMIT = 140;
export const TAG_CHARACTERS_LIMIT = 12;

export const MAIN_SECTIONS = [
    {
        name: 'Start live video',
        img: '',
        icon: 'video_call',
        link: '/users/video/start-live-video',
        auth: true,
        production: true
    },
    {name: 'Home', img: '', icon: 'home', link: '/', auth: false, production: true},
    {name: 'Trending', img: 'item-9.png', icon: '', link: '/trending', separator: true, auth: false, production: true},
    {
        name: 'News feed',
        img: 'item-8.png',
        icon: '',
        link: '/posts/news-feed',

        production: true,
        auth: true
    },
    {name: 'Messages', img: 'item-8.png', icon: '', link: '/chat/messages', production: true, auth: true},
    {name: 'Groups', img: 'group.svg', icon: '', link: '/groups', production: true, auth: true, separator: true,},

    {name: 'Saved videos', img: 'saved-videos.svg', icon: '', link: '/videos/saved', production: true, auth: true},
    {name: 'Videos', img: 'item-11.png', icon: '', link: '/videos', auth: true, separator: false, production: true},
    {name: 'Clipz', img: 'item-11.png', icon: '', link: '/clipz', auth: true, separator: true, production: true},
    {name: 'Analytics', img: 'item-9.png', icon: '', link: '/stocks/analytics', auth: true, production: true},
];

export const MINI_GRAPHS_TABS = [
    {name: 'My Watchlist', value: 'watchlist'},
    {name: 'Today', value: 'today'},
];

export const VIDEOJS_PLAYER_OPTIONS = {
    preload: 'metadata',
    controls: true,
    autoplay: true,
    overrideNative: true,
    techOrder: ['html5'],
    html5: {
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false,
        // hls: {
        //     withCredentials: false,
        //     overrideNative: true,
        //     debug: true
        // }
    },
    controlBar: {
        pictureInPictureToggle: false
    }
};

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51HdPckKqYIKd5fEInH0pL35DSdkG9JfxAiuT7K3JutO3zFseApoTCjdj72fK82tORdAjDIUOPQzSm62DIeUUmdpw00OhdcsU0p';
export const STRIPE_CARD_OPTIONS: StripeCardElementOptions = {
    style: {
        base: {
            iconColor: '#666EE8',
            color: '#31325F',
            fontWeight: '300',
            fontFamily: '\'Helvetica Neue\', Helvetica, sans-serif',
            fontSize: '18px',
            '::placeholder': {
                color: '#CFD7E0'
            }
        }
    },
    hidePostalCode: true
};


export const ALL_COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
    'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi',
    'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia',
    'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
    'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador',
    'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
    'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
    'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast',
    'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
    'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
    'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
    'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
    'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia',
    'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
    'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
    'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
    'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
    'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

export const ALLOWED_COUNTRIES = ['us'];
export const DEFAULT_COUNTRY = 'us';

export const COIN_WORTH = 0.0199;

export const CK_EDITOR_CONFIG =
    {
        removePlugins: 'toolbar',
        toolbar: {
            items: [
                'bold',
                'italic',
                'link',
                '|',
                'bulletedList',
                'numberedList',
                '|',
                'insertTable',
                '|',
                'imageUpload',
                '|',
                'undo',
                'redo'
            ]
        },
        image: {
            toolbar: [
                'imageStyle:full',
                'imageStyle:side',
                '|',
                'imageTextAlternative'
            ]
        },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        },
        language: 'en'
    };
