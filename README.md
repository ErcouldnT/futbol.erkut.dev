# Akkuyu Futbol

Halısaha maçları için kadro oluşturma ve maç yonetim uygulaması.

**[futbol.erkut.dev](https://futbol.erkut.dev)**

## Ozellikler

- **Kadro Olusturucu** - Sürükle-bırak ile oyuncuları saha üzerinde konumlandır
- **Mac Yonetimi** - Maçları kaydet, takip et, gol ve puan durumunu gor
- **Kadro Paylasma** - Kadroyu PNG olarak WhatsApp ve diger uygulamalarda paylaş
- **Oyuncu Havuzu** - Oyuncuları ekle, numaralarını düzenle, takımlara ata
- **Mobil Uyumlu** - Telefon ve tablette tam uyumlu tasarım

## Tech Stack

| Katman     | Teknoloji                            |
| ---------- | ------------------------------------ |
| Framework  | Svelte 5, SvelteKit 2                |
| Styling    | Tailwind CSS 4, DaisyUI 5            |
| Database   | SQLite (Better-SQLite3), Drizzle ORM |
| Screenshot | modern-screenshot                    |
| Deploy     | Docker                               |

## Gelistirme

```bash
npm install
npm run db:push
npm run dev
```

## Deploy

```bash
docker compose up -d --build
```

## Lisans

[MIT](LICENSE)
