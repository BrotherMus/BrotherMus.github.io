/* Quick questions: a scripted helper, not an AI. Visitors pick a question and get a prewritten answer.
   Every fact here is already on the site (homepage, Career, Leadership, Games). Update both together.
   Links: internal links use clean URLs; external links open in a new tab (shown with ↗). */
(function (global) {
  'use strict';

  global.CHAT_SCRIPT = {
    title: 'Quick questions',
    subtitle: 'Pick a question. Answers are prewritten by Mus\'ab.',
    greeting: 'Hi, I\'m Mus\'ab. Pick a question below and I\'ll answer it.',
    moreLabel: 'Anything else?',
    questions: [
      {
        id: 'who',
        q: 'Who are you?',
        a: 'I\'m Mus\'ab Anas, a Unity game developer in Selangor, Malaysia, with 4+ years in game development. I build playable games, connected products and interactive experiences with Unity and C#.',
        links: [{ label: 'My career', href: 'career' }]
      },
      {
        id: 'now',
        q: 'What do you do right now?',
        a: 'I\'m a Game Designer / Developer at Goolee Sdn. Bhd. I also run Musidev Games, my game studio since 2022, and I co-founded Double Scape Studios in 2026.',
        links: [{ label: 'My studios', href: './#studio' }]
      },
      {
        id: 'studios',
        q: 'Tell me about your studios',
        a: 'Musidev Games is my game studio. It makes mobile, PC, web and event games, with games delivered for MR DIY, Celcom Digi, Kumon, KOI Thé, Organon and INABA. Double Scape Studios is a digital creative studio in Kajang that I run with a partner. It builds websites and web apps for Malaysian businesses, and Musidev Games is its games unit.',
        links: [
          { label: 'musidevgames.com', href: 'https://musidevgames.com/', external: true },
          { label: 'doublescapestudios.com', href: 'https://doublescapestudios.com/', external: true }
        ]
      },
      {
        id: 'games',
        q: 'What games have you made?',
        a: 'I\'ve delivered 40+ games and projects. A few: AppsGoolee, my main project at Goolee; event games for MR DIY, Celcom Digi, KOI Thé and Organon; and Type Rush, my own Roblox typing game.',
        links: [
          { label: 'Games', href: 'games' },
          { label: 'All games', href: 'https://musidevgames.com/games/', external: true }
        ]
      },
      {
        id: 'tools',
        q: 'What tools do you use?',
        a: 'Mostly Unity and C#, with PlayFab, Git / GitHub, Google Play Games and WebGL. For connected products I work with ESP32, Arduino, Bluetooth / BLE and sensors, and I use AI-assisted workflows for web and prototyping.',
        links: [{ label: 'What I build', href: './#services' }]
      },
      {
        id: 'lead',
        q: 'Do you lead or mentor people?',
        a: 'Yes. I\'ve mentored 14 interns: 9 at Goolee and 5 at Musidev Games, including international university interns from Japan. I also lead the technical side of projects and keep devices running at events.',
        links: [{ label: 'Leadership', href: 'leadership' }]
      },
      {
        id: 'education',
        q: 'What did you study?',
        a: 'A Diploma in Computer Science (Game Development) at University Malaysia of Computer Science & Engineering, 2017 to 2021. In 2024 I added SKM Level 3 in 3D Game Asset Production and a Professional Certificate in Game Development, both from Todak Academy.',
        links: [{ label: 'Education', href: 'career' }]
      },
      {
        id: 'hire',
        q: 'Can I hire you or work with you?',
        a: 'Yes. I\'m open to game development opportunities, collaborations and interesting technical projects. Email me at musabanas99@gmail.com or call +60 17-957 4837. For a business website, Double Scape Studios is the place to ask.',
        links: [
          { label: 'Email me', href: 'mailto:musabanas99@gmail.com' },
          { label: 'View my CV', href: 'assets/resume/Musab-Anas-Resume.pdf', external: true },
          { label: 'Double Scape', href: 'https://doublescapestudios.com/', external: true }
        ]
      }
    ]
  };
}(window));
