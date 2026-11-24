/*
 * Multimedia showcase on the homepage (#video-work and #design-work).
 * Videos: use a YouTube id (thumbnail and player load from YouTube), or a local `src` + `poster`
 * under assets/multimedia/video/. Players only load when clicked.
 * Designs: each design lists its page images under assets/multimedia/design/ (full size + thumbnail).
 * Empty groups are not rendered. Add onsite event videos to the 'events' group when ready.
 * The Goolee YouTube videos were removed on 24 Nov 2026 (kept in _archive/2026-11-24-goolee-youtube-videos/);
 * `moreUrl` points to Mus'ab's "VIDEO EDITING" playlist (videos edited without AI).
 */
window.MULTIMEDIA_VIDEOS = {
  credit: 'Edited by Mus’ab for Goolee',
  moreUrl: 'https://www.youtube.com/playlist?list=PLH0OThhNIQqc',
  moreLabel: 'Watch the playlist',
  moreTitle: 'All my video editing in one playlist',
  moreText: 'The videos I edited myself, without AI, collected in one YouTube playlist.',
  groups: [
    {
      id: 'vr-launch',
      title: 'VR game launch',
      videos: [
        {
          src: 'assets/multimedia/video/mara-vr-launch.mp4',
          poster: 'assets/multimedia/video/mara-vr-launch.webp',
          title: 'VR Goolee launch video',
          note: 'Owned by Goolee Sdn. Bhd. · Special appreciation: Majlis Amanah Rakyat (MARA)'
        }
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
