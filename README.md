# अखिल भारतीय आदिवासी हलबा हलबी समाज — बालोद महासभा पंजीयन सिस्टम

## सुविधाएँ
- मोबाइल-फ्रेंडली पंजीयन फॉर्म और नियम एवं शर्तों की अलग पेज।
- Google Sheet में रिकॉर्ड सेव करने के लिए Google Apps Script Web App।
- ईमेल या मोबाइल पहले से मौजूद होने पर नया पंजीयन रोकना।
- पुराने रिकॉर्ड के ईमेल और मोबाइल दोनों मेल होने पर ही प्रिंट प्रति उपलब्ध।
- सुरक्षित एडमिन लॉगिन, डैशबोर्ड आँकड़े, जिला/ब्लॉक/गाँव/लिंग फ़िल्टर, नाम/ईमेल/मोबाइल खोज।
- रिकॉर्ड और फ़िल्टर की गई सूची प्रिंट करना।

## 1. Google Sheet बनाएँ
1. Google Drive में नई Google Sheet बनाएँ, जैसे `Halba Balod Mahasabha Registration`.
2. Sheet में **Extensions → Apps Script** खोलें.
3. इस ZIP की `google-apps-script.gs` फ़ाइल का पूरा code Apps Script के `Code.gs` में paste करें और Save करें.
4. Apps Script में **Project Settings → Script properties → Add script property** पर जाएँ और ये दो properties बनाएँ:
   - `ADMIN_USERNAME` = अपना एडमिन यूज़रनेम
   - `ADMIN_PASSWORD` = मजबूत, अलग और अनुमान लगाना कठिन पासवर्ड
5. Apps Script editor में `setupSheet` चुनकर Run करें और permissions Allow करें. इससे `Registrations` sheet तथा आवश्यक headers बनेंगे. पुराने 14 कॉलम हों तो जिला/ब्लॉक/गाँव के नए कॉलम जोड़ दिए जाएँगे.

**Google Sheet को public न करें और “Anyone with the link can edit” न चुनें।** Sheet आपके Google account में private रहनी चाहिए.

## 2. Apps Script Web App deploy करें
1. Apps Script में **Deploy → New deployment → Web app** चुनें.
2. **Execute as: Me** चुनें.
3. सार्वजनिक पंजीयन के लिए access को **Anyone** (जहाँ उपलब्ध हो, anonymous public access) रखें.
4. Deploy करें, Google authorization पूरा करें और `/exec` पर समाप्त होने वाला Web App URL copy करें.
5. यदि Code.gs में बदलाव करने के बाद deployment update करें, तो **Deploy → Manage deployments → Edit → New version → Deploy** करना न भूलें.

## 3. Web App URL जोड़ें
`script.js` और `admin.js` दोनों फ़ाइलों की पहली पंक्ति में:

`const APPS_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";`

को अपने deployed Apps Script `/exec` URL से बदलें. दोनों फ़ाइलों में एक ही URL होना चाहिए.

## 4. GitHub Pages पर upload करें
Repository के root में ये फ़ाइलें रखें:

- `index.html`
- `terms.html`
- `admin.html`
- `style.css`
- `admin.css`
- `script.js`
- `admin.js`
- `assets/logo.webp`

`google-apps-script.gs` को GitHub पर रखना जरूरी नहीं है; सुरक्षा के लिए उसे केवल Apps Script project में रखना बेहतर है. GitHub repository को Pages पर deploy करें: **Settings → Pages → Deploy from branch → main → /(root)**.

## 5. पेज कैसे इस्तेमाल होंगे
- पंजीयन फॉर्म: `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`
- एडमिन लॉगिन: `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/admin.html`

एडमिन यूज़रनेम/पासवर्ड केवल Apps Script की Script Properties में रखें; उन्हें `script.js`, `admin.js`, HTML या GitHub में कभी न डालें. लॉगिन सत्र ब्राउज़र के session storage में रहता है और backend token लगभग 6 घंटे तक मान्य होता है.

## Duplicate रोकने का नियम
यदि ईमेल या मोबाइल में से कोई भी पहले से मौजूद है, तो नया रिकॉर्ड सेव नहीं होगा. पुराने रिकॉर्ड की प्रिंट प्रति तभी खुलेगी जब ईमेल और मोबाइल दोनों एक ही पुराने रिकॉर्ड से मेल खाएँ. केवल एक फ़ील्ड मेल होने पर किसी मौजूदा व्यक्ति की जानकारी प्रदर्शित नहीं की जाएगी.

## महत्वपूर्ण नोट
यह GitHub Pages + Apps Script + Google Sheet आधारित हल्का registration system है. सार्वजनिक पंजीयन के लिए Apps Script deployment में anonymous access उपलब्ध होना आवश्यक है; कुछ Google Workspace accounts में administrator यह access सीमित कर सकता है. Admin password मजबूत रखें और Sheet की access permissions निजी रखें.
