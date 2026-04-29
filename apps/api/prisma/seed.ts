import { createPrismaClient } from "../src/app/lib/prisma";
import { slugify } from "@setlist-app/shared-utils";

const prisma = createPrismaClient();

async function main() {
  console.log('Bereinige Datenbank...')
  await prisma.instrument.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.setlistEntry.deleteMany({});
  await prisma.setlist.deleteMany({});
  await prisma.song.deleteMany({});

  console.log('Datenbank ist Leer, starte Import...')

    // Lead Vocalists
  const Volker = await prisma.member.create({
    data: {
      name: 'Volker',
      isLeadVocalist: true,
    }
  });
  const Bernd = await prisma.member.create({
    data: {
      name: 'Bernd',
      isLeadVocalist: true,
    }
  });

  // Songs
  const songs = [
    {
      title: 'Straw In The Wind',
      artist: 'The Steel Woods',
      duration: 270, tempo: 57, key: 'Dm',
      leadVocals: [Volker]
    },
    {
      title: 'Whitehouse Road',
      artist: 'Tyler Childers',
      duration: 310, tempo: 158, key: 'D',
      leadVocals: [Bernd]
    },
    {
      title: 'Hideaway',
      artist: 'The Beat Farmers',
      duration: 280, tempo: 138, key: 'Am',
      leadVocals: [Volker]
    },
    {
      title: 'Hurricane',
      artist: 'The Band Of Heathens',
      duration: 310, tempo: 130, key: 'Am',
      leadVocals: [Bernd]
    },
    {
      title: 'Copperhead Road',
      artist: 'Steve Earle',
      duration: 260, tempo: 83, key: 'D',
      leadVocals: [Bernd]
    },
    {
      title: 'Turn The Page',
      artist: 'Bob Seger',
      duration: 240, tempo: 82, key: 'Dm',
      leadVocals: [Volker]
    },
    {
      title: 'Blue On Black',
      artist: 'Kenny Wayne Shepherd',
      duration: 260, tempo: 78, key: 'D',
      leadVocals: [Bernd]
    },
    {
      title: 'Simple Man',
      artist: 'Lynyrd Skynyrd',
      duration: 370, tempo: 60, key: 'Am',
      leadVocals: [Volker]
    },
    {
      title: 'Sunrise In Texas',
      artist: 'Blackberry Smoke',
      duration: 260, tempo: 80, key: 'D',
      leadVocals: [Bernd]
    },
    {
      title: 'Up In Indiana',
      artist: 'Lyle Lovett',
      duration: 290, tempo: 94, key: 'D',
      leadVocals: [Bernd]
    },
    {
      title: 'Let The Rain Come Down',
      artist: 'Steel Woods; Brent Cobb',
      duration: 280, tempo: 79, key: 'D',
      leadVocals: [Volker, Bernd]
    },
    {
      title: 'Jackson Station',
      artist: 'The Band Of Heathens',
      duration: 230, tempo: 63, key: 'G',
      leadVocals: [Bernd, Volker]
    },
    {
      title: 'In Hell I´ll Be In Good Company',
      artist: 'The Dead South',
      duration: 260, tempo: 78, key: 'Am',
      leadVocals: [Volker, Bernd]
    },
    {
      title: 'Angel From Montgomery',
      artist: 'John Prine',
      duration: 230, tempo: 64, key: 'A',
      leadVocals: [Bernd]
    },
    {
      title: 'Tennessee Whiskey',
      artist: 'Chris Stapleton',
      duration: 340, tempo: 56, key: 'G',
      leadVocals: [Volker],
    },
    {
      title: 'Paper In Fire',
      artist: 'John Mellencamp',
      duration: 250, tempo: 142, key: 'Hm',
      leadVocals: [Volker]
    },
    {
      title: 'The World´s On Fire',
      artist: 'American Aquarium',
      duration: 330, tempo: 68, key: 'E',
      leadVocals: [Volker]
    },
    {
      title: 'Travelin Soldier',
      artist: 'Cody Johnson',
      duration: 240, tempo: 78, key: 'D',
      leadVocals: [Volker]
    },
    {
      title: 'You`ve Got Another Thing Comin`',
      artist: 'Alex Williams',
      duration: 262, tempo: 129, key: 'Cm',
      leadVocals: [Bernd, Volker]
    },
    {
      title: 'Gris Gris Satchel',
      artist: 'The Band Of Heathens',
      duration: 240, tempo: 70, key: 'D',
      leadVocals: [Bernd, Volker]
    },
    {
      title: 'Als Ich Fortging',
      artist: 'Karussell',
      duration: 270, tempo: 104, key: 'Em',
      leadVocals: [Volker]
    },
    {
      title: 'Und musst du weinen',
      artist: 'G. Gundermann und Seilschaft',
      duration: 278, tempo: 125, key: 'D',
      leadVocals: [Volker]
    },
    {
      title: 'Broken Window Serenade',
      artist: 'Whiskey Myers',
      duration: 332, tempo: 77, key: 'D',
      leadVocals: [Volker]
    },
    {
      title: 'Ramblin`',
      artist: 'The Red Clay Strays',
      duration: 153, tempo: 109, key: 'A',
      leadVocals: [Bernd, Volker]
    },
    {
      title: 'White Wedding',
      artist: 'Billy Idol',
      duration: 210, tempo: 168, key: 'D',
      leadVocals: [Bernd]
    },
    {
      title: 'Let It Burn',
      artist: 'Blackberry Smoke',
      duration: 177, tempo: 210, key: 'G',
      leadVocals: [Volker, Bernd]
    },
    {
      title: 'Life ain`t easy',
      artist: 'New Roses',
      duration: 241, tempo: 128, key: 'D',
      leadVocals: [Volker, Bernd]
    },
    {
      title: 'Ballad of a Broken Hearted Man',
      artist: 'Robert Jon & the Wreck',
      duration: 320, tempo: 76, key: 'D',
      leadVocals: [Volker, Bernd]
    },
    {
      title: 'When I`m Dead and Gone',
      artist: 'Fury In The Slaughterhouse',
      duration: 241, tempo: 227, key: 'D',
      leadVocals: [Volker, Bernd]
    },
  ];

  for (const song of songs) {
    await prisma.song.create({
      data: {
        slug: slugify(song.title),
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        tempo: song.tempo,
        key: song.key,
        leadVocals: song.leadVocals.map((lead) => lead.name).join(', '),
      }
    });
  }
  
  // Setlist
  await prisma.setlist.create({
    data: {
      date: new Date('2025-05-17'),
      location: 'Kahlscheurer Weiher',
      slug: '2025-05-17-kahlscheurer-weiher',
      name: 'ALL am Kal',
      duration: 60,
      entries: {
        create: [
          {
            position: 1, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[0].title) }, }
          },
          {
            position: 2, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[1].title) }, }
          },
          {
            position: 3, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[2].title) }, }
          },
          {
            position: 4, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[3].title) }, }
          },
          {
            position: 5, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[4].title) }, }
          },
          {
            position: 6, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[5].title) }, }
          },
          {
            position: 7, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[6].title) }, }
          },
          {
            position: 8, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[7].title) }, }
          },
          {
            position: 9, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[9].title) }, }
          },
          {
            position: 10, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[8].title) }, }
          },
          {
            position: 11, isOptional: false, isEncore: false,
            song: { connect: { slug: slugify(songs[10].title) }, }
          },
        ]
      }
    }
  });
  await prisma.setlist.create({
    data: {
      date: new Date('2025-08-02'),
      location: 'Kajüte Ratzdorf',
      slug: '2025-09-02-kajüte-ratzdorf',
      name: 'Ratzdorf Open Air',
      duration: 90,
    }
  });
  await prisma.setlist.create({
    data: {
      date: new Date('2025-11-29'),
      location: 'Kultur-Raumkonzepte',
      slug: '2025-11-29-kultur-raumkonzepte',
      name: 'Musiker-Flohmarkt Rösrath',
      duration: 60,
    }
  });

  console.log('Datenbank ist wieder gefüllt!')
}

main().catch(console.error).finally(() => prisma.$disconnect());