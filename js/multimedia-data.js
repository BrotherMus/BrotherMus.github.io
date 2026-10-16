/*
 * Multimedia showcase on the homepage (#video-work and #design-work).
 * Videos: use a YouTube id (thumbnail and player load from YouTube), or a local `src` + `poster`
 * under assets/multimedia/video/. Players only load when clicked.
 * Designs: each design lists its page images under assets/multimedia/design/ (full size + thumbnail).
 * Empty groups are not rendered. Add onsite event videos to the 'events' group when ready.
 */
window.MULTIMEDIA_VIDEOS = {
  credit: 'Edited by Mus’ab for Goolee',
  moreUrl: 'https://www.tiktok.com/@gooleebydrzieman',
  moreLabel: 'More on Goolee’s TikTok',
  groups: [
    {
      id: 'vr-launch',
      title: 'VR game launch',
      videos: [
        {
          src: 'assets/multimedia/video/mara-vr-launch.mp4',
          poster: 'assets/multimedia/video/mara-vr-launch.webp',
          title: 'VR Goolee – Launch video',
          note: 'Owned by Goolee Sdn. Bhd. · Special appreciation: Majlis Amanah Rakyat (MARA)'
        }
      ]
    },
    {
      id: 'app-promotion',
      title: 'App promotion',
      videos: [
        { youtube: 'A0ouoso3HL0', title: 'GOOLEE – New Pattern Update · Official Trailer' },
        { youtube: 'GatPO_N5Uzs', title: 'Video Game Trailer – How to Play' },
        { youtube: 'MHVeHLpk2SU', title: 'POV: Kucing Tengah Main AppsGoolee' }
      ]
    },
    {
      id: 'raya',
      title: 'Raya campaign',
      videos: [
        { youtube: 'KJI_kLkmxVg', title: 'Boleh Score 10/10? Kuiz Raya Challenge 2026!' },
        { youtube: 'UPgpUaTJqtc', title: 'Apakah kuih raya kegemaran team Goolee? (Part 2)' }
      ]
    },
    {
      id: 'events',
      title: 'Onsite events',
      videos: []
    }
  ]
};

window.MULTIMEDIA_DESIGNS = {
  credit: 'Designed by Mus’ab for Goolee',
  designs: [
    {
      id: 'appsgoolee-brochure',
      title: 'AppsGoolee brochure',
      note: 'Made for MDEC',
      pages: [
        { src: 'assets/multimedia/design/appsgoolee-brochure-1.webp', thumb: 'assets/multimedia/design/appsgoolee-brochure-1-thumb.webp', alt: 'AppsGoolee brochure cover: Turn Thinking Into Fun' },
        { src: 'assets/multimedia/design/appsgoolee-brochure-2.webp', thumb: 'assets/multimedia/design/appsgoolee-brochure-2-thumb.webp', alt: 'AppsGoolee brochure page: Driven by Innovation, Empowering Thinkers' },
        { src: 'assets/multimedia/design/appsgoolee-brochure-3.webp', thumb: 'assets/multimedia/design/appsgoolee-brochure-3-thumb.webp', alt: 'AppsGoolee brochure page: Recognition and Achievements' },
        { src: 'assets/multimedia/design/appsgoolee-brochure-4.webp', thumb: 'assets/multimedia/design/appsgoolee-brochure-4-thumb.webp', alt: 'AppsGoolee brochure back cover: A World Where Everyone Think Better' }
      ]
    },
    {
      id: 'goolee-bunting',
      title: 'Goolee bunting',
      note: 'Made for MDEC',
      pages: [
        { src: 'assets/multimedia/design/goolee-bunting.webp', thumb: 'assets/multimedia/design/goolee-bunting-thumb.webp', alt: 'Goolee bunting: Level Up Your Strategic Thinking The Fun Way, 180+ levels' }
      ]
    }
  ]
};
