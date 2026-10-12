# Usha — Software QA Engineer Portfolio

A responsive React + Vite + JavaScript portfolio. Website content is in English.

## চালু করুন

এই ফোল্ডারে টার্মিনাল খুলে `npm.cmd run dev` চালান। টার্মিনালের Local ঠিকানাটি ব্রাউজারে খুলুন (সাধারণত http://localhost:5173/)। বন্ধ করতে Ctrl + C চাপুন।

## লেখা ও লিংক পরিবর্তন

`src/data.js` ফাইলে ব্যক্তিগত তথ্য, পরিচিতি, দক্ষতা, অভিজ্ঞতা, প্রজেক্ট, সার্টিফিকেট ও লিংক রয়েছে। `src/App.jsx` ফাইলে পেজের reusable components এবং `src/App.css` ও `src/index.css` ফাইলে ডিজাইন রয়েছে।

## আসল CV যোগ করুন

আসল PDF এখন `public/Usha_SQA_Resume.pdf` ফাইলে আছে। সব Download CV বোতাম `/Usha_SQA_Resume.pdf` URL ব্যবহার করে। ফাইলটির বিষয়বস্তু বদলানো হয়নি। ভবিষ্যতে একই নামে PDF বদলে পেজ রিফ্রেশ করুন; কোড বদলাতে হবে না। Download CV সরাসরি সক্রিয় লিংক; পুরোনো unavailable state সরানো হয়েছে। সাইট প্রকাশের পরে PDF বদলালে আবার build/deploy করতে হবে।

## নিজের ছবি যোগ করুন

`public/` ফোল্ডারে ছবি রাখুন, যেমন `usha-photo.jpg`। তারপর `src/data.js` ফাইলে `profileImage: ''` এর জায়গায় `profileImage: '/usha-photo.jpg'` লিখুন। 88px circular portrait দেখাবে। ফিল্ড খালি থাকলে ছবির জায়গা থাকবে না। ভুল image path হলে broken image দেখানো হবে না।

## পরীক্ষা

- `npm.cmd run build`: production build
- `npm.cmd run lint`: code checks
- `npm.cmd run preview`: production build স্থানীয়ভাবে দেখুন

বর্তমান ডিজাইন https://alishuvo.pages.dev/ সাইটের visual style অনুসরণ করে তৈরি: centered hero, restrained blue gradient, floating pill navigation ও bento cards। Let’s Connect সরাসরি LinkedIn খুলে; Contact heading ব্যবহার করা হয়েছে। আপনার নিজের SQA তথ্য, project links ও resume ব্যবহার করা হয়েছে। About-এর chat-style প্রশ্ন ও উত্তর স্থির portfolio content; কোনো AI chat বা message form নয়। ছবি খালি থাকলে portrait দেখায় না। Mobile menu, More menu, active navigation, remembered light/dark theme, email, Copy Email ও CV download রয়েছে। Reduced motion preference মানা হয়; animation setup ব্যর্থ হলেও লেখা দৃশ্যমান থাকে। নতুন dependency যোগ করা হয়নি। Google Fonts না পাওয়া গেলে system sans-serif fallback ব্যবহৃত হয়।

Browser verification-এর জন্য `scripts/check-ui.mjs` রয়েছে। Headless Edge/Chrome port 9223-এ চালু এবং dev server port 5173-এ চললে `node scripts/check-ui.mjs` দিয়ে 1440px, 768px ও 390px-এ দুই theme, menu, email copy, CV download ও reduced motion পরীক্ষা করা যায়। Screenshots system temporary folder-এ থাকে। সাধারণভাবে project চালাতে এই script লাগবে না।


## QA articles

Edit `src/content/qa-articles.md` to update the six articles. Keep the numbered top-level article headings, **Excerpt:** and **Tags:** metadata; source order determines card and Previous/Next order. Titles are displayed without numbering. Reading time uses article word count at 200 words/minute. Markdown tables are supported; raw HTML is skipped.

The dedicated listing page uses `#/articles` (legacy `#articles` links also open it). Articles are absent from the homepage. Each article uses a `#/articles/<title-slug>` URL compatible with static hosting. Article slugs are fixed in `src/articles.js`, so changing a title preserves its URL. Components and styles live in `src/Articles.jsx` and `src/Articles.css`; parsing lives in `src/articles.js`.

With the dev server at port 5173 and a debugging browser at port 9223, run `node scripts/check-articles.mjs` to verify source preservation, all readers, responsive themes, refresh, history and section navigation.
