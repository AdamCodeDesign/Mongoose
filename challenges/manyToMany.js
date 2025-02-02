/* 

    Zadanie z many to many - artyści i albumy:
    1. Stwórz schemat artysty z polem name oraz albums jako tablica z typem ObjectId i referencją
       do Album
    2. Napisz schemat opisujący album z polem title, created, artists jako tablica z typem ObjectId
       oraz referencją do Artist. W ten sposób stworzysz dwukierunkową relację many to many między
       artystami a albumami
    3. Skasuj wszystkich artystów i albumy w bazie
    4. Dodaj funkcję createArtist(artist) oraz createAlbum(album) z zapisem danych z create()
    5. Napisz funkcję addArtistToAlbum(artist, album) pozwalającą na połączenie relacji many to many
       między artystami i albumami
    6. Utwórz funkcję getArtistData(id) oraz getAlbumData(id), pamiętaj o użyciu populate()
    7. Stwórz dwóch artystów z createArtist() oraz jeden album z createAlbum(), połącz album oraz
       artystów używając addArtistToAlbum(artist, album) 
    8. Pobierz z bazy pierwszego artystę z getArtistData() i pokaż go w konsoli
    9. Pobierz album z bazy korzystając z getAlbumData() i wyświetl go w konsoli 
*/

import mongoose from "mongoose";
const url = "mongodb://127.0.0.1:27017/manyToMany";
mongoose.connect(url);

const artistSchema = mongoose.Schema({
  name: String,
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
  ],
});

const Artist = mongoose.model("Artist", artistSchema);

const albumSchema = mongoose.Schema({
  title: String,
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
  created: {
    type: Date,
    default: Date.now,
  },
});

const Album = mongoose.model("Album", albumSchema);

await Artist.deleteMany({});
await Album.deleteMany({});

async function createArtist(artist) {
  return await Artist.create(artist);
}

async function createAlbum(album) {
  return await Album.create(album);
}

async function addArtistToAlbum(artist, album) {
  const dbArtist = await Artist.findByIdAndUpdate(
    artist._id,
    { $push: { albums: album._id } },
    { new: true }
  );
  const dbAlbum = await Album.findByIdAndUpdate(
    album._id,
    { $push: { artists: artist._id } },
    { new: true }
  );

  return {
    dbArtist,
    dbAlbum,
  };
}

async function getArtistData(id) {
  return await Artist.findById(id).populate("albums");
}

async function getAlbumData(id) {
  return await Album.findById(id).populate("artists");
}

let artist1 = await createArtist({
  name: "Adam",
});

let artist2 = await createArtist({
  name: "Joanna",
});

let artist3 = await createArtist({
  name: "Michael",
});

let album1 = await createAlbum({ title: "Holydays" });
let album2 = await createAlbum({ title: "Christmas" });
let album3 = await createAlbum({ title: "Birthdays" });

await addArtistToAlbum(artist1, album1);
await addArtistToAlbum(artist2, album1);
await addArtistToAlbum(artist3, album1);
await addArtistToAlbum(artist1, album2);
await addArtistToAlbum(artist1, album3);

const artistDb = await getArtistData(artist1._id)
const albumDb = await getAlbumData(album1._id)

console.log('artistDb', artistDb)
console.log('albumDb', albumDb)