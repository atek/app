// Contact address shown on every page. Replace before publishing.
const CONTACT_EMAIL = "ahmettek6@gmail.com";
const EULA = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";
const REFUND = "https://reportaproblem.apple.com";

// All page text lives here: I18N[code] = { name, nav: [privacy, support, terms, language], p, s, t }
// where p/s/t (privacy/support/terms) = [title, subtitle, [[heading, text], ...]].
// {EMAIL}, {EULA} and {REFUND} are replaced; https:// URLs become links.
const I18N = {};
function L(code, name, d) { I18N[code] = Object.assign({ name }, d); }
const RTL = ["ar", "he"];
const PAGES = { p: "privacy.html", s: "support.html", t: "terms.html" };
const ALIASES = { iw: "he", in: "id", no: "nb", nn: "nb", zh: "zh-Hans" };

function matchLang(tag) {
  if (!tag) return null;
  const exact = Object.keys(I18N).find((k) => k.toLowerCase() === tag.toLowerCase());
  if (exact) return exact;
  const base = tag.split(/[-_]/)[0].toLowerCase();
  if (base === "zh") return /hant|tw|hk|mo/i.test(tag) ? "zh-Hant" : "zh-Hans";
  if (I18N[base]) return base;
  return ALIASES[base] || null;
}

function pickLanguage() {
  const fromHash = matchLang(decodeURIComponent(location.hash.slice(1)));
  if (fromHash) return fromHash;
  try { const saved = localStorage.getItem("lang"); if (I18N[saved]) return saved; } catch (e) {}
  for (const pref of navigator.languages || [navigator.language]) {
    const m = matchLang(pref);
    if (m) return m;
  }
  return "en";
}

function renderPage(key) {
  const lang = pickLanguage();
  try { localStorage.setItem("lang", lang); } catch (e) {}
  const d = I18N[lang];
  const [title, subtitle, sections] = d[key];
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL.includes(lang) ? "rtl" : "ltr";
  document.title = title + " · Globie";
  document.getElementById("title").textContent = title;
  document.getElementById("date").textContent = subtitle;
  const email = `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`;
  const fill = (t) => t.replace("{EULA}", EULA).replace("{REFUND}", REFUND)
    .replace(/https:\/\/[^\s<]*[^\s<.,;)。，]/g, (u) => `<a href="${u}" dir="ltr">${u}</a>`)
    .replace("{EMAIL}", email);
  document.getElementById("content").innerHTML = sections
    .map(([h, p]) => `<section><h2>${h}</h2><p>${fill(p)}</p></section>`).join("");
  const options = Object.entries(I18N)
    .map(([code, l]) => `<option value="${code}"${code === lang ? " selected" : ""}>${l.name}</option>`).join("");
  document.getElementById("langs").innerHTML =
    `<label>🌐 <span class="sr">${d.nav[3]}</span><select aria-label="${d.nav[3]}">${options}</select></label>`;
  document.querySelector("#langs select").onchange = (e) => { location.hash = e.target.value; };
  document.getElementById("links").innerHTML = Object.entries(PAGES)
    .map(([k, file], i) => k === key ? `<strong>${d.nav[i]}</strong>` : `<a href="${file}#${lang}">${d.nav[i]}</a>`)
    .join(" · ");
}

function startPage(key) {
  window.addEventListener("hashchange", () => renderPage(key));
  renderPage(key);
}

L("en", "English", {
  nav: ["Privacy", "Support", "Terms", "Language"],
  p: ["Privacy Policy", "Effective November 25, 2026", [
    ["Summary", "Globie has no ads, no accounts and no tracking. Your photos never leave your iPhone. The only data that leaves the device is what is needed to handle the Christmas Pass purchase (see Purchases)."],
    ["Photos", "You choose a photo with the system photo picker, so Globie never sees the rest of your library. The person or pet is cut out on your device with Apple's Vision framework. The picture and your snow globes are stored only inside the app on your iPhone. Nothing is uploaded. Saving a video or picture asks for add-only access to Photos."],
    ["Widget and reminders", "The widget reads a small picture of your globe from the app's own storage on your device. The optional daily reminder is a local notification created on your iPhone."],
    ["Purchases", "The optional Christmas Pass is a one-time In-App Purchase handled by Apple; we never see your payment details. To check and restore purchases we use RevenueCat (https://www.revenuecat.com/privacy). The app sends RevenueCat a random anonymous ID created by the app, your purchases in the app, the app version and your device's country and language. This is not linked to your name or Apple ID and is not used for advertising or tracking."],
    ["Third parties", "Apart from RevenueCat for purchases, there is no third-party advertising, analytics, social media or other code in the app, and the app makes no other internet connections."],
    ["Your rights", "We hold no name, email or contact details. The anonymous purchase record can be deleted on request: write to {EMAIL}. Deleting the app deletes all photos and globes; a purchase stays with your Apple ID so it can be restored."],
    ["Changes", "If this policy changes, we will update this page and the date above."],
    ["Contact", "Questions about privacy: {EMAIL}"]]],
  s: ["Support", "Globie: Christmas Snow Globe", [
    ["How do I put my family in the globe?", "Tap “Add a family photo” and pick a photo. People and pets are cut out automatically. A photo with a plain background works best. If nobody is found, the photo is placed in an oval frame."],
    ["How do I make it snow?", "Shake or tilt your iPhone, or tap the globe."],
    ["How do I send it?", "Open your globe and tap “Send”. You can share a 12-second video card, a square picture or save a Live Photo."],
    ["How do I add the widget?", "Touch and hold the Home Screen, tap Edit, then Add Widget and search for Globie. With the Christmas Pass, the widget shows your own globe."],
    ["Restore my purchase", "Open the purchase sheet or Settings and tap “Restore purchase”. The Christmas Pass works on every device with the same Apple Account and with Family Sharing."],
    ["Contact", "Write to {EMAIL} and we will reply."]]],
  t: ["Terms of Use", "Effective November 23, 2026", [
    ["License", "Globie is licensed to you under Apple's Standard Licensed Application End User License Agreement (EULA): {EULA} — these terms only add a few points about Globie."],
    ["Christmas Pass", "Creating snow globes is free. The optional Christmas Pass is a one-time In-App Purchase, not a subscription. It unlocks video and Live Photo export, removes the watermark and shows your own globe on the widget. You can restore it on your devices with the same Apple Account."],
    ["Payments and refunds", "All payments are processed by Apple. Refunds are handled by Apple under its policies; you can request one at {REFUND}"],
    ["Your content", "Your photos and globes stay on your device and remain yours. We never receive, store or use them. Only use photos you have the right to use and share."],
    ["Warranty", "The app is provided “as is”, to the extent permitted by law, as described in the Apple EULA. We may update the app and these terms; the date above shows the latest version."],
    ["Contact", "{EMAIL}"]]],
});

L("de", "Deutsch", {
  nav: ["Datenschutz", "Support", "Nutzungsbedingungen", "Sprache"],
  p: ["Datenschutzerklärung", "Gültig ab 25. November 2026", [
    ["Zusammenfassung", "Globie hat keine Werbung, keine Konten und kein Tracking. Deine Fotos verlassen nie dein iPhone. Nur die für den Christmas Pass nötigen Kaufdaten verlassen das Gerät (siehe Käufe)."],
    ["Fotos", "Du wählst ein Foto über die Fotoauswahl des Systems, daher sieht Globie den Rest deiner Mediathek nie. Person oder Tier werden auf deinem Gerät mit Apples Vision-Framework freigestellt. Das Bild und deine Schneekugeln werden nur in der App auf deinem iPhone gespeichert. Nichts wird hochgeladen. Beim Sichern eines Videos oder Bildes wird nur um Schreibzugriff auf Fotos gebeten."],
    ["Widget und Erinnerungen", "Das Widget liest ein kleines Bild deiner Kugel aus dem Speicher der App auf deinem Gerät. Die optionale tägliche Erinnerung ist eine lokale Mitteilung auf deinem iPhone."],
    ["Käufe", "Der optionale Christmas Pass ist ein einmaliger In-App-Kauf über Apple; deine Zahlungsdaten sehen wir nie. Zum Prüfen und Wiederherstellen von Käufen nutzen wir RevenueCat (https://www.revenuecat.com/privacy). Die App sendet an RevenueCat eine zufällige, anonyme ID der App, deine Käufe in der App, die App-Version sowie Land und Sprache des Geräts. Das ist nicht mit deinem Namen oder deiner Apple-ID verknüpft und wird nicht für Werbung oder Tracking genutzt."],
    ["Dritte", "Außer RevenueCat für Käufe gibt es keinen Code von Drittanbietern für Werbung, Analyse oder soziale Medien, und die App baut keine anderen Internetverbindungen auf."],
    ["Deine Rechte", "Wir speichern keinen Namen, keine E-Mail und keine Kontaktdaten. Den anonymen Kaufdatensatz löschen wir auf Anfrage: schreib an {EMAIL}. Das Löschen der App löscht alle Fotos und Kugeln; ein Kauf bleibt bei deiner Apple-ID und kann wiederhergestellt werden."],
    ["Änderungen", "Wenn sich diese Erklärung ändert, aktualisieren wir diese Seite und das Datum oben."],
    ["Kontakt", "Fragen zum Datenschutz: {EMAIL}"]]],
  s: ["Support", "Globie: Schneekugel mit Foto", [
    ["Wie kommt meine Familie in die Kugel?", "Tippe auf „Familienfoto hinzufügen“ und wähle ein Foto. Personen und Tiere werden automatisch freigestellt. Ein ruhiger Hintergrund klappt am besten. Wird niemand gefunden, kommt das Foto in einen ovalen Rahmen."],
    ["Wie lasse ich es schneien?", "Schüttle oder neige dein iPhone oder tippe auf die Kugel."],
    ["Wie verschicke ich sie?", "Öffne deine Kugel und tippe auf „Senden“. Du kannst eine 12-Sekunden-Videokarte oder ein quadratisches Bild teilen oder ein Live Photo sichern."],
    ["Wie füge ich das Widget hinzu?", "Halte den Home-Bildschirm gedrückt, tippe auf Bearbeiten, dann auf Widget hinzufügen und suche nach Globie. Mit dem Christmas Pass zeigt das Widget deine eigene Kugel."],
    ["Kauf wiederherstellen", "Öffne das Kaufblatt oder die Einstellungen und tippe auf „Kauf wiederherstellen“. Der Christmas Pass gilt auf allen Geräten mit demselben Apple Account und in der Familienfreigabe."],
    ["Kontakt", "Schreib an {EMAIL}, wir antworten."]]],
  t: ["Nutzungsbedingungen", "Gültig ab 23. November 2026", [
    ["Lizenz", "Globie wird dir unter Apples Standard-Endbenutzer-Lizenzvertrag (EULA) lizenziert: {EULA} — diese Bedingungen ergänzen nur einige Punkte zu Globie."],
    ["Christmas Pass", "Schneekugeln erstellen ist kostenlos. Der optionale Christmas Pass ist ein einmaliger In-App-Kauf, kein Abo. Er schaltet Video- und Live-Photo-Export frei, entfernt das Wasserzeichen und zeigt deine eigene Kugel im Widget. Du kannst ihn auf deinen Geräten mit demselben Apple Account wiederherstellen."],
    ["Zahlung und Erstattung", "Alle Zahlungen wickelt Apple ab. Erstattungen bearbeitet Apple nach seinen Richtlinien; du kannst sie hier anfordern: {REFUND}"],
    ["Deine Inhalte", "Deine Fotos und Kugeln bleiben auf deinem Gerät und gehören dir. Wir erhalten, speichern oder nutzen sie nie. Verwende nur Fotos, die du nutzen und teilen darfst."],
    ["Gewährleistung", "Die App wird, soweit gesetzlich zulässig, „wie besehen“ bereitgestellt, wie im Apple-EULA beschrieben. Wir können die App und diese Bedingungen aktualisieren; das Datum oben zeigt die aktuelle Fassung."],
    ["Kontakt", "{EMAIL}"]]],
});

L("tr", "Türkçe", {
  nav: ["Gizlilik", "Destek", "Kullanım Koşulları", "Dil"],
  p: ["Gizlilik Politikası", "Yürürlük tarihi: 25 Kasım 2026", [
    ["Özet", "Globie'de reklam, hesap ve takip yoktur. Fotoğrafların iPhone'undan hiç çıkmaz. Cihazdan çıkan tek veri, Christmas Pass satın alımını yönetmek için gerekenlerdir (bkz. Satın almalar)."],
    ["Fotoğraflar", "Fotoğrafı sistemin fotoğraf seçicisiyle seçersin, bu yüzden Globie galerinin geri kalanını hiç görmez. Kişi ya da hayvan, Apple'ın Vision altyapısıyla cihazında ayrılır. Fotoğraf ve kar kürelerin yalnızca iPhone'undaki uygulamanın içinde saklanır. Hiçbir şey yüklenmez. Video ya da görsel kaydederken yalnızca Fotoğraflar'a ekleme izni istenir."],
    ["Widget ve hatırlatmalar", "Widget, kürenin küçük bir görselini cihazındaki uygulama depolamasından okur. İsteğe bağlı günlük hatırlatma, iPhone'unda oluşturulan yerel bir bildirimdir."],
    ["Satın alma", "İsteğe bağlı Christmas Pass, Apple üzerinden yapılan tek seferlik bir uygulama içi satın almadır; ödeme bilgilerini hiç görmeyiz. Satın almaları kontrol etmek ve geri yüklemek için RevenueCat kullanırız (https://www.revenuecat.com/privacy). Uygulama RevenueCat'e, uygulamanın oluşturduğu rastgele anonim bir kimlik, uygulamadaki satın almaların, uygulama sürümü ve cihazının ülke ve dil bilgisini gönderir. Bu bilgiler adınla veya Apple kimliğinle ilişkilendirilmez, reklam veya takip için kullanılmaz."],
    ["Üçüncü taraflar", "Satın almalar için RevenueCat dışında uygulamada üçüncü taraf reklam, analiz, sosyal medya veya başka bir kod yoktur; uygulama başka bir internet bağlantısı kurmaz."],
    ["Hakların", "Ad, e-posta veya iletişim bilgisi tutmayız. Anonim satın alma kaydı istek üzerine silinir: {EMAIL} adresine yaz. Uygulamayı silmek tüm fotoğrafları ve küreleri siler; satın alma Apple kimliğinde kalır ve geri yüklenebilir."],
    ["Değişiklikler", "Bu politika değişirse bu sayfayı ve yukarıdaki tarihi güncelleriz."],
    ["İletişim", "Gizlilik soruları: {EMAIL}"]]],
  s: ["Destek", "Globie: Fotoğraflı Kar Küresi", [
    ["Ailemi küreye nasıl koyarım?", "“Aile fotoğrafı ekle”ye dokun ve bir fotoğraf seç. Kişiler ve hayvanlar otomatik ayrılır. Düz arka planlı fotoğraf en iyi sonucu verir. Kimse bulunamazsa fotoğraf oval çerçeveye konur."],
    ["Kar nasıl yağar?", "iPhone'unu salla ya da eğ veya küreye dokun."],
    ["Nasıl gönderirim?", "Küreni aç ve “Gönder”e dokun. 12 saniyelik video kart ya da kare görsel paylaşabilir veya Live Photo kaydedebilirsin."],
    ["Widget'ı nasıl eklerim?", "Ana ekrana basılı tut, Düzenle'ye, sonra Widget Ekle'ye dokun ve Globie'yi ara. Christmas Pass ile widget'ta kendi küren görünür."],
    ["Satın alımı geri yükle", "Satın alma ekranını ya da Ayarlar'ı aç ve “Satın alımı geri yükle”ye dokun. Christmas Pass aynı Apple Hesabı'ndaki tüm cihazlarda ve Aile Paylaşımı'nda geçerlidir."],
    ["İletişim", "{EMAIL} adresine yaz, yanıtlarız."]]],
  t: ["Kullanım Koşulları", "Yürürlük tarihi: 23 Kasım 2026", [
    ["Lisans", "Globie, Apple'ın Standart Son Kullanıcı Lisans Sözleşmesi (EULA) kapsamında lisanslanır: {EULA} — bu koşullar yalnızca Globie'ye özel birkaç madde ekler."],
    ["Christmas Pass", "Kar küresi oluşturmak ücretsizdir. İsteğe bağlı Christmas Pass tek seferlik bir Uygulama İçi Satın Alma'dır, abonelik değildir. Video ve Live Photo dışa aktarımını açar, filigranı kaldırır ve widget'ta kendi küreni gösterir. Aynı Apple Hesabı'ndaki cihazlarında geri yükleyebilirsin."],
    ["Ödeme ve iade", "Tüm ödemeler Apple tarafından alınır. İadeler Apple'ın kurallarına göre Apple tarafından yapılır; buradan talep edebilirsin: {REFUND}"],
    ["İçeriğin", "Fotoğrafların ve kürelerin cihazında kalır ve sana aittir. Onları hiçbir zaman almaz, saklamaz veya kullanmayız. Yalnızca kullanma ve paylaşma hakkın olan fotoğrafları kullan."],
    ["Garanti", "Uygulama, yasaların izin verdiği ölçüde, Apple EULA'da açıklandığı gibi “olduğu gibi” sunulur. Uygulamayı ve bu koşulları güncelleyebiliriz; yukarıdaki tarih son sürümü gösterir."],
    ["İletişim", "{EMAIL}"]]],
});

L("fr", "Français", {
  nav: ["Confidentialité", "Assistance", "Conditions", "Langue"],
  p: ["Politique de confidentialité", "En vigueur le 25 novembre 2026", [
    ["En bref", "Globie n’a ni publicité, ni compte, ni pistage. Tes photos ne quittent jamais ton iPhone. Seules les données nécessaires à l’achat du Christmas Pass quittent l’appareil (voir Achats)."],
    ["Photos", "Vous choisissez une photo avec le sélecteur du système : Globie ne voit jamais le reste de votre photothèque. La personne ou l'animal est détouré sur votre appareil avec le framework Vision d'Apple. La photo et vos boules à neige sont stockées uniquement dans l'app sur votre iPhone. Rien n'est envoyé. Pour enregistrer une vidéo ou une image, seul l'accès en ajout à Photos est demandé."],
    ["Widget et rappels", "Le widget lit une petite image de votre boule dans le stockage de l'app sur votre appareil. Le rappel quotidien facultatif est une notification locale."],
    ["Achats", "Le Christmas Pass facultatif est un achat intégré unique géré par Apple ; nous ne voyons jamais tes données de paiement. Pour vérifier et restaurer les achats, nous utilisons RevenueCat (https://www.revenuecat.com/privacy). L’app envoie à RevenueCat un identifiant anonyme aléatoire créé par l’app, tes achats dans l’app, la version de l’app ainsi que le pays et la langue de l’appareil. Ces données ne sont liées ni à ton nom ni à ton identifiant Apple et ne servent ni à la publicité ni au pistage."],
    ["Tiers", "En dehors de RevenueCat pour les achats, l’app ne contient aucun code tiers de publicité, d’analyse ou de réseaux sociaux, et n’établit aucune autre connexion Internet."],
    ["Vos droits", "Nous ne conservons ni nom, ni e-mail, ni coordonnées. L’enregistrement anonyme d’achat est supprimé sur demande : écris à {EMAIL}. Supprimer l’app efface toutes les photos et boules ; un achat reste lié à ton identifiant Apple et peut être restauré."],
    ["Contact", "Questions sur la confidentialité : {EMAIL}"]]],
  s: ["Assistance", "Globie", [
    ["Comment mettre ma famille dans la boule ?", "Dans l'éditeur, touchez le bouton Photo et choisissez une photo. Les personnes et les animaux sont détourés automatiquement ; un fond uni donne le meilleur résultat. Si personne n'est trouvé, la photo est placée dans un cadre ovale."],
    ["Comment faire neiger ?", "Secouez ou inclinez votre iPhone, ou touchez la boule."],
    ["Comment l'envoyer ?", "Ouvrez votre boule et touchez Envoyer. Vous pouvez partager une carte vidéo de 12 secondes, une image carrée ou enregistrer une Live Photo."],
    ["Comment ajouter le widget ?", "Maintenez le doigt sur l'écran d'accueil, touchez Modifier, puis Ajouter un widget et cherchez Globie. Avec le Christmas Pass, le widget affiche votre propre boule."],
    ["Restaurer mon achat", "Ouvrez l'écran d'achat ou les Réglages et touchez Restaurer l'achat. Le Christmas Pass fonctionne sur tous les appareils avec le même compte Apple et avec le Partage familial."],
    ["Contact", "Écrivez à {EMAIL}, nous vous répondrons."]]],
  t: ["Conditions d'utilisation", "En vigueur le 23 novembre 2026", [
    ["Licence", "Globie vous est concédé sous le contrat de licence utilisateur final standard d'Apple (EULA) : {EULA} — ces conditions n'ajoutent que quelques points propres à Globie."],
    ["Christmas Pass", "Créer des boules à neige est gratuit. Le Christmas Pass facultatif est un achat intégré unique, pas un abonnement. Il débloque l'export vidéo et Live Photo, retire le filigrane et affiche votre boule dans le widget. Vous pouvez le restaurer sur vos appareils avec le même compte Apple."],
    ["Paiements et remboursements", "Tous les paiements sont traités par Apple. Les remboursements sont gérés par Apple selon ses règles ; vous pouvez en demander un ici : {REFUND}"],
    ["Votre contenu", "Vos photos et vos boules restent sur votre appareil et vous appartiennent. Nous ne les recevons, ne les stockons ni ne les utilisons jamais. N'utilisez que des photos que vous avez le droit d'utiliser et de partager."],
    ["Garantie", "L'app est fournie « en l'état », dans les limites autorisées par la loi, comme décrit dans l'EULA d'Apple. Nous pouvons mettre à jour l'app et ces conditions ; la date ci-dessus indique la dernière version."],
    ["Contact", "{EMAIL}"]]],
});

L("es", "Español", {
  nav: ["Privacidad", "Soporte", "Términos", "Idioma"],
  p: ["Política de privacidad", "Vigente desde el 25 de noviembre de 2026", [
    ["Resumen", "Globie no tiene anuncios, cuentas ni rastreo. Tus fotos nunca salen de tu iPhone. Los únicos datos que salen del dispositivo son los necesarios para la compra del Christmas Pass (ver Compras)."],
    ["Fotos", "Eliges una foto con el selector del sistema, así que Globie nunca ve el resto de tu fototeca. La persona o mascota se recorta en tu dispositivo con el framework Vision de Apple. La foto y tus bolas de nieve se guardan solo dentro de la app en tu iPhone. No se sube nada. Para guardar un vídeo o una imagen solo se pide permiso para añadir a Fotos."],
    ["Widget y recordatorios", "El widget lee una pequeña imagen de tu bola desde el almacenamiento de la app en tu dispositivo. El recordatorio diario opcional es una notificación local."],
    ["Compras", "El Christmas Pass opcional es una compra integrada única gestionada por Apple; nunca vemos tus datos de pago. Para comprobar y restaurar compras usamos RevenueCat (https://www.revenuecat.com/privacy). La app envía a RevenueCat un ID anónimo aleatorio creado por la app, tus compras en la app, la versión de la app y el país e idioma del dispositivo. No se vincula a tu nombre ni a tu ID de Apple y no se usa para publicidad ni rastreo."],
    ["Terceros", "Aparte de RevenueCat para las compras, la app no contiene código de terceros de publicidad, analítica o redes sociales, y no hace otras conexiones a Internet."],
    ["Tus derechos", "No guardamos nombre, correo ni datos de contacto. El registro anónimo de compra se borra si lo pides: escribe a {EMAIL}. Borrar la app elimina todas las fotos y bolas; la compra queda en tu ID de Apple y se puede restaurar."],
    ["Contacto", "Preguntas sobre privacidad: {EMAIL}"]]],
  s: ["Soporte", "Globie", [
    ["¿Cómo meto a mi familia en la bola?", "En el editor, toca el botón Foto y elige una foto. Las personas y mascotas se recortan automáticamente; un fondo liso funciona mejor. Si no se encuentra a nadie, la foto se coloca en un marco ovalado."],
    ["¿Cómo hago que nieve?", "Agita o inclina tu iPhone, o toca la bola."],
    ["¿Cómo la envío?", "Abre tu bola y toca Enviar. Puedes compartir una tarjeta de vídeo de 12 segundos, una imagen cuadrada o guardar una Live Photo."],
    ["¿Cómo añado el widget?", "Mantén pulsada la pantalla de inicio, toca Editar, luego Añadir widget y busca Globie. Con el Christmas Pass, el widget muestra tu propia bola."],
    ["Restaurar mi compra", "Abre la pantalla de compra o Ajustes y toca Restaurar compra. El Christmas Pass funciona en todos los dispositivos con la misma cuenta de Apple y con En familia."],
    ["Contacto", "Escribe a {EMAIL} y te responderemos."]]],
  t: ["Términos de uso", "Vigentes desde el 23 de noviembre de 2026", [
    ["Licencia", "Globie se te concede bajo el Contrato de licencia de usuario final estándar de Apple (EULA): {EULA} — estos términos solo añaden algunos puntos sobre Globie."],
    ["Christmas Pass", "Crear bolas de nieve es gratis. El Christmas Pass opcional es una compra única dentro de la app, no una suscripción. Desbloquea la exportación de vídeo y Live Photo, quita la marca de agua y muestra tu bola en el widget. Puedes restaurarlo en tus dispositivos con la misma cuenta de Apple."],
    ["Pagos y reembolsos", "Apple procesa todos los pagos. Los reembolsos los gestiona Apple según sus políticas; puedes solicitarlo aquí: {REFUND}"],
    ["Tu contenido", "Tus fotos y bolas se quedan en tu dispositivo y son tuyas. Nunca las recibimos, guardamos ni usamos. Usa solo fotos que tengas derecho a usar y compartir."],
    ["Garantía", "La app se ofrece «tal cual», en la medida permitida por la ley, como se describe en el EULA de Apple. Podemos actualizar la app y estos términos; la fecha de arriba indica la versión vigente."],
    ["Contacto", "{EMAIL}"]]],
});

L("it", "Italiano", {
  nav: ["Privacy", "Assistenza", "Termini", "Lingua"],
  p: ["Informativa sulla privacy", "In vigore dal 25 novembre 2026", [
    ["In breve", "Globie non ha pubblicità, account né tracciamento. Le tue foto non lasciano mai l’iPhone. Escono dal dispositivo solo i dati necessari per l’acquisto del Christmas Pass (vedi Acquisti)."],
    ["Foto", "Scegli una foto con il selettore di sistema, quindi Globie non vede mai il resto della tua libreria. La persona o l'animale viene scontornato sul dispositivo con il framework Vision di Apple. La foto e le tue palle di neve sono salvate solo nell'app sul tuo iPhone. Non viene caricato nulla. Per salvare un video o un'immagine viene chiesto solo l'accesso in aggiunta a Foto."],
    ["Widget e promemoria", "Il widget legge una piccola immagine della tua palla dalla memoria dell'app sul dispositivo. Il promemoria giornaliero facoltativo è una notifica locale."],
    ["Acquisti", "Il Christmas Pass facoltativo è un acquisto in-app unico gestito da Apple; non vediamo mai i tuoi dati di pagamento. Per verificare e ripristinare gli acquisti usiamo RevenueCat (https://www.revenuecat.com/privacy). L’app invia a RevenueCat un ID anonimo casuale creato dall’app, i tuoi acquisti nell’app, la versione dell’app e paese e lingua del dispositivo. Questi dati non sono collegati al tuo nome o ID Apple e non sono usati per pubblicità o tracciamento."],
    ["Terze parti", "Oltre a RevenueCat per gli acquisti, nell’app non c’è codice di terzi per pubblicità, analisi o social, e l’app non effettua altre connessioni a Internet."],
    ["I tuoi diritti", "Non conserviamo nome, e-mail o contatti. Il record anonimo di acquisto viene cancellato su richiesta: scrivi a {EMAIL}. Eliminare l’app cancella tutte le foto e le palle; l’acquisto resta legato al tuo ID Apple e può essere ripristinato."],
    ["Contatti", "Domande sulla privacy: {EMAIL}"]]],
  s: ["Assistenza", "Globie", [
    ["Come metto la mia famiglia nella palla?", "Nell'editor tocca il pulsante Foto e scegli una foto. Persone e animali vengono scontornati automaticamente; uno sfondo uniforme funziona meglio. Se non viene trovato nessuno, la foto va in una cornice ovale."],
    ["Come faccio nevicare?", "Scuoti o inclina l'iPhone, oppure tocca la palla."],
    ["Come la invio?", "Apri la tua palla e tocca Invia. Puoi condividere un biglietto video di 12 secondi, un'immagine quadrata o salvare una Live Photo."],
    ["Come aggiungo il widget?", "Tieni premuto sulla schermata Home, tocca Modifica, poi Aggiungi widget e cerca Globie. Con il Christmas Pass il widget mostra la tua palla."],
    ["Ripristina l'acquisto", "Apri la schermata di acquisto o le Impostazioni e tocca Ripristina acquisto. Il Christmas Pass vale su tutti i dispositivi con lo stesso account Apple e con In famiglia."],
    ["Contatti", "Scrivi a {EMAIL} e ti risponderemo."]]],
  t: ["Termini d'uso", "In vigore dal 23 novembre 2026", [
    ["Licenza", "Globie ti è concesso in licenza secondo il Contratto di licenza standard per l'utente finale di Apple (EULA): {EULA} — questi termini aggiungono solo alcuni punti su Globie."],
    ["Christmas Pass", "Creare palle di neve è gratis. Il Christmas Pass facoltativo è un acquisto in-app una tantum, non un abbonamento. Sblocca l'esportazione video e Live Photo, rimuove la filigrana e mostra la tua palla nel widget. Puoi ripristinarlo sui tuoi dispositivi con lo stesso account Apple."],
    ["Pagamenti e rimborsi", "Tutti i pagamenti sono gestiti da Apple. I rimborsi sono gestiti da Apple secondo le sue regole; puoi richiederne uno qui: {REFUND}"],
    ["I tuoi contenuti", "Le tue foto e palle restano sul tuo dispositivo e sono tue. Non le riceviamo, conserviamo né usiamo mai. Usa solo foto che hai il diritto di usare e condividere."],
    ["Garanzia", "L'app è fornita «così com'è», nei limiti consentiti dalla legge, come descritto nell'EULA di Apple. Possiamo aggiornare l'app e questi termini; la data sopra indica la versione in vigore."],
    ["Contatti", "{EMAIL}"]]],
});

L("pt", "Português", {
  nav: ["Privacidade", "Suporte", "Termos", "Idioma"],
  p: ["Política de Privacidade", "Em vigor a partir de 25 de novembro de 2026", [
    ["Resumo", "O Globie não tem anúncios, contas nem rastreamento. Suas fotos nunca saem do iPhone. Os únicos dados que saem do aparelho são os necessários para a compra do Christmas Pass (veja Compras)."],
    ["Fotos", "Você escolhe uma foto pelo seletor do sistema, então o Globie nunca vê o resto da sua biblioteca. A pessoa ou o pet é recortado no seu aparelho com o framework Vision da Apple. A foto e seus globos de neve ficam salvos só dentro do app no seu iPhone. Nada é enviado. Ao salvar um vídeo ou imagem, só é pedido acesso para adicionar a Fotos."],
    ["Widget e lembretes", "O widget lê uma pequena imagem do seu globo no armazenamento do app no aparelho. O lembrete diário opcional é uma notificação local."],
    ["Compras", "O Christmas Pass opcional é uma compra única no app feita pela Apple; nunca vemos seus dados de pagamento. Para verificar e restaurar compras usamos o RevenueCat (https://www.revenuecat.com/privacy). O app envia ao RevenueCat um ID anônimo aleatório criado pelo app, suas compras no app, a versão do app e o país e idioma do aparelho. Isso não é ligado ao seu nome nem ao seu ID Apple e não é usado para publicidade ou rastreamento."],
    ["Terceiros", "Além do RevenueCat para compras, o app não tem código de terceiros de publicidade, análise ou redes sociais, e não faz outras conexões à internet."],
    ["Seus direitos", "Não guardamos nome, e-mail ou contato. O registro anônimo de compra é apagado a pedido: escreva para {EMAIL}. Apagar o app remove todas as fotos e globos; a compra fica no seu ID Apple e pode ser restaurada."],
    ["Contato", "Dúvidas sobre privacidade: {EMAIL}"]]],
  s: ["Suporte", "Globie", [
    ["Como coloco minha família no globo?", "No editor, toque no botão Foto e escolha uma foto. Pessoas e pets são recortados automaticamente; um fundo liso funciona melhor. Se ninguém for encontrado, a foto vai para uma moldura oval."],
    ["Como faço nevar?", "Sacuda ou incline o iPhone, ou toque no globo."],
    ["Como envio?", "Abra seu globo e toque em Enviar. Você pode compartilhar um cartão em vídeo de 12 segundos, uma imagem quadrada ou salvar uma Live Photo."],
    ["Como adiciono o widget?", "Toque e segure a Tela de Início, toque em Editar, depois em Adicionar Widget e procure Globie. Com o Christmas Pass, o widget mostra seu próprio globo."],
    ["Restaurar minha compra", "Abra a tela de compra ou os Ajustes e toque em Restaurar compra. O Christmas Pass vale em todos os aparelhos com a mesma Conta Apple e no Compartilhamento Familiar."],
    ["Contato", "Escreva para {EMAIL} e responderemos."]]],
  t: ["Termos de Uso", "Em vigor a partir de 23 de novembro de 2026", [
    ["Licença", "O Globie é licenciado a você pelo Contrato de Licença de Usuário Final padrão da Apple (EULA): {EULA} — estes termos só acrescentam alguns pontos sobre o Globie."],
    ["Christmas Pass", "Criar globos de neve é grátis. O Christmas Pass opcional é uma compra única dentro do app, não uma assinatura. Ele libera a exportação de vídeo e Live Photo, remove a marca-d'água e mostra seu globo no widget. Você pode restaurá-lo nos seus aparelhos com a mesma Conta Apple."],
    ["Pagamentos e reembolsos", "Todos os pagamentos são processados pela Apple. Reembolsos são tratados pela Apple conforme as regras dela; você pode pedir aqui: {REFUND}"],
    ["Seu conteúdo", "Suas fotos e globos ficam no seu aparelho e são seus. Nunca os recebemos, guardamos ou usamos. Use apenas fotos que você tem direito de usar e compartilhar."],
    ["Garantia", "O app é fornecido “como está”, na medida permitida por lei, conforme descrito no EULA da Apple. Podemos atualizar o app e estes termos; a data acima mostra a versão atual."],
    ["Contato", "{EMAIL}"]]],
});

L("nl", "Nederlands", {
  nav: ["Privacy", "Support", "Voorwaarden", "Taal"],
  p: ["Privacybeleid", "Geldig vanaf 25 november 2026", [
    ["Samenvatting", "Globie heeft geen advertenties, geen accounts en geen tracking. Je foto’s verlaten je iPhone nooit. Alleen de gegevens die nodig zijn voor de aankoop van de Christmas Pass verlaten het apparaat (zie Aankopen)."],
    ["Foto's", "Je kiest een foto met de fotokiezer van het systeem, dus Globie ziet de rest van je bibliotheek nooit. De persoon of het huisdier wordt op je toestel uitgesneden met Apples Vision-framework. De foto en je sneeuwbollen worden alleen in de app op je iPhone bewaard. Er wordt niets geüpload. Voor het bewaren van een video of afbeelding wordt alleen om toevoegtoegang tot Foto's gevraagd."],
    ["Widget en herinneringen", "De widget leest een kleine afbeelding van je bol uit de opslag van de app op je toestel. De optionele dagelijkse herinnering is een lokale melding."],
    ["Aankopen", "De optionele Christmas Pass is een eenmalige in-app-aankoop via Apple; je betaalgegevens zien wij nooit. Om aankopen te controleren en te herstellen gebruiken we RevenueCat (https://www.revenuecat.com/privacy). De app stuurt RevenueCat een willekeurige anonieme ID van de app, je aankopen in de app, de appversie en land en taal van het apparaat. Dit is niet gekoppeld aan je naam of Apple ID en wordt niet gebruikt voor advertenties of tracking."],
    ["Derden", "Behalve RevenueCat voor aankopen bevat de app geen code van derden voor advertenties, analyse of sociale media, en maakt de app geen andere internetverbindingen."],
    ["Je rechten", "We bewaren geen naam, e-mail of contactgegevens. Het anonieme aankooprecord verwijderen we op verzoek: mail {EMAIL}. De app verwijderen wist alle foto’s en bollen; een aankoop blijft bij je Apple ID en kan worden hersteld."],
    ["Contact", "Vragen over privacy: {EMAIL}"]]],
  s: ["Support", "Globie", [
    ["Hoe zet ik mijn gezin in de bol?", "Tik in de editor op de knop Foto en kies een foto. Mensen en huisdieren worden automatisch uitgesneden; een rustige achtergrond werkt het best. Wordt er niemand gevonden, dan komt de foto in een ovale lijst."],
    ["Hoe laat ik het sneeuwen?", "Schud of kantel je iPhone, of tik op de bol."],
    ["Hoe verstuur ik hem?", "Open je bol en tik op Versturen. Je kunt een videokaart van 12 seconden of een vierkante afbeelding delen, of een Live Photo bewaren."],
    ["Hoe voeg ik de widget toe?", "Houd je vinger op het beginscherm, tik op Wijzig, dan op Voeg widget toe en zoek naar Globie. Met de Christmas Pass toont de widget je eigen bol."],
    ["Aankoop herstellen", "Open het aankoopscherm of Instellingen en tik op Aankoop herstellen. De Christmas Pass werkt op alle toestellen met dezelfde Apple Account en met Delen met gezin."],
    ["Contact", "Mail naar {EMAIL}, we antwoorden je."]]],
  t: ["Gebruiksvoorwaarden", "Geldig vanaf 23 november 2026", [
    ["Licentie", "Globie wordt aan je gelicentieerd onder Apples standaard licentieovereenkomst voor eindgebruikers (EULA): {EULA} — deze voorwaarden voegen alleen een paar punten over Globie toe."],
    ["Christmas Pass", "Sneeuwbollen maken is gratis. De optionele Christmas Pass is een eenmalige in-app-aankoop, geen abonnement. Hij ontgrendelt video- en Live Photo-export, haalt het watermerk weg en toont je eigen bol in de widget. Je kunt hem herstellen op je toestellen met dezelfde Apple Account."],
    ["Betalingen en terugbetalingen", "Alle betalingen worden door Apple verwerkt. Terugbetalingen regelt Apple volgens zijn beleid; je kunt er hier een aanvragen: {REFUND}"],
    ["Jouw inhoud", "Je foto's en bollen blijven op je toestel en zijn van jou. We ontvangen, bewaren of gebruiken ze nooit. Gebruik alleen foto's die je mag gebruiken en delen."],
    ["Garantie", "De app wordt, voor zover de wet toestaat, geleverd ‘zoals hij is’, zoals beschreven in de EULA van Apple. We kunnen de app en deze voorwaarden bijwerken; de datum hierboven toont de huidige versie."],
    ["Contact", "{EMAIL}"]]],
});

L("sv", "Svenska", {
  nav: ["Integritet", "Support", "Villkor", "Språk"],
  p: ["Integritetspolicy", "Gäller från 25 november 2026", [
    ["Sammanfattning", "Globie har ingen reklam, inga konton och ingen spårning. Dina bilder lämnar aldrig din iPhone. Det enda som lämnar enheten är det som behövs för köpet av Christmas Pass (se Köp)."],
    ["Bilder", "Du väljer en bild med systemets bildväljare, så Globie ser aldrig resten av ditt bibliotek. Personen eller husdjuret klipps ut på din enhet med Apples Vision-ramverk. Bilden och dina snöglobar sparas bara i appen på din iPhone. Inget laddas upp. För att spara en video eller bild begärs bara åtkomst att lägga till i Bilder."],
    ["Widget och påminnelser", "Widgeten läser en liten bild av din glob från appens lagring på enheten. Den valfria dagliga påminnelsen är en lokal notis."],
    ["Köp", "Det valfria Christmas Pass är ett engångsköp i appen via Apple; vi ser aldrig dina betaluppgifter. För att kontrollera och återställa köp använder vi RevenueCat (https://www.revenuecat.com/privacy). Appen skickar till RevenueCat ett slumpat anonymt ID från appen, dina köp i appen, appversionen samt enhetens land och språk. Det kopplas inte till ditt namn eller Apple-ID och används inte för reklam eller spårning."],
    ["Tredje part", "Utöver RevenueCat för köp finns ingen kod från tredje part för reklam, analys eller sociala medier, och appen gör inga andra internetanslutningar."],
    ["Dina rättigheter", "Vi sparar inget namn, ingen e-post och inga kontaktuppgifter. Den anonyma köpposten raderas på begäran: skriv till {EMAIL}. Att radera appen raderar alla bilder och glober; ett köp finns kvar på ditt Apple-ID och kan återställas."],
    ["Kontakt", "Frågor om integritet: {EMAIL}"]]],
  s: ["Support", "Globie", [
    ["Hur får jag in familjen i globen?", "Tryck på knappen Bild i redigeraren och välj en bild. Personer och husdjur klipps ut automatiskt; en enkel bakgrund fungerar bäst. Om ingen hittas placeras bilden i en oval ram."],
    ["Hur får jag det att snöa?", "Skaka eller luta din iPhone, eller tryck på globen."],
    ["Hur skickar jag den?", "Öppna din glob och tryck på Skicka. Du kan dela ett 12 sekunder långt videokort, en kvadratisk bild eller spara en Live Photo."],
    ["Hur lägger jag till widgeten?", "Håll fingret på hemskärmen, tryck på Redigera, sedan Lägg till widget och sök efter Globie. Med Christmas Pass visar widgeten din egen glob."],
    ["Återställ mitt köp", "Öppna köpskärmen eller Inställningar och tryck på Återställ köp. Christmas Pass fungerar på alla enheter med samma Apple-konto och med Familjedelning."],
    ["Kontakt", "Skriv till {EMAIL} så svarar vi."]]],
  t: ["Användarvillkor", "Gäller från 23 november 2026", [
    ["Licens", "Globie licensieras till dig enligt Apples standardlicensavtal för slutanvändare (EULA): {EULA} — dessa villkor lägger bara till några punkter om Globie."],
    ["Christmas Pass", "Att skapa snöglobar är gratis. Det valfria Christmas Pass är ett engångsköp i appen, inte en prenumeration. Det låser upp export av video och Live Photo, tar bort vattenstämpeln och visar din egen glob i widgeten. Du kan återställa det på dina enheter med samma Apple-konto."],
    ["Betalning och återbetalning", "Alla betalningar hanteras av Apple. Återbetalningar hanteras av Apple enligt Apples regler; du kan begära en här: {REFUND}"],
    ["Ditt innehåll", "Dina bilder och globar stannar på din enhet och tillhör dig. Vi tar aldrig emot, sparar eller använder dem. Använd bara bilder som du har rätt att använda och dela."],
    ["Garanti", "Appen tillhandahålls ”i befintligt skick” i den mån lagen tillåter, enligt Apples EULA. Vi kan uppdatera appen och villkoren; datumet ovan visar aktuell version."],
    ["Kontakt", "{EMAIL}"]]],
});

L("da", "Dansk", {
  nav: ["Privatliv", "Support", "Vilkår", "Sprog"],
  p: ["Privatlivspolitik", "Gælder fra 25. november 2026", [
    ["Kort fortalt", "Globie har ingen reklamer, ingen konti og ingen sporing. Dine billeder forlader aldrig din iPhone. Det eneste, der forlader enheden, er det, der skal bruges til købet af Christmas Pass (se Køb)."],
    ["Fotos", "Du vælger et foto med systemets fotovælger, så Globie ser aldrig resten af dit bibliotek. Personen eller kæledyret klippes ud på din enhed med Apples Vision-framework. Fotoet og dine snekugler gemmes kun i appen på din iPhone. Intet uploades. For at gemme en video eller et billede bedes der kun om adgang til at tilføje til Fotos."],
    ["Widget og påmindelser", "Widgetten læser et lille billede af din kugle fra appens lager på enheden. Den valgfri daglige påmindelse er en lokal notifikation."],
    ["Køb", "Det valgfrie Christmas Pass er et engangskøb i appen via Apple; vi ser aldrig dine betalingsoplysninger. Til at tjekke og gendanne køb bruger vi RevenueCat (https://www.revenuecat.com/privacy). Appen sender RevenueCat et tilfældigt anonymt ID fra appen, dine køb i appen, appversionen samt enhedens land og sprog. Det knyttes ikke til dit navn eller Apple-id og bruges ikke til reklamer eller sporing."],
    ["Tredjeparter", "Ud over RevenueCat til køb er der ingen kode fra tredjeparter til reklamer, analyse eller sociale medier, og appen laver ingen andre internetforbindelser."],
    ["Dine rettigheder", "Vi gemmer intet navn, ingen e-mail og ingen kontaktoplysninger. Den anonyme købspost slettes på anmodning: skriv til {EMAIL}. Sletter du appen, slettes alle billeder og kugler; et køb bliver på dit Apple-id og kan gendannes."],
    ["Kontakt", "Spørgsmål om privatliv: {EMAIL}"]]],
  s: ["Support", "Globie", [
    ["Hvordan kommer min familie ind i kuglen?", "Tryk på knappen Foto i editoren, og vælg et foto. Personer og kæledyr klippes automatisk ud; en rolig baggrund virker bedst. Findes ingen, placeres fotoet i en oval ramme."],
    ["Hvordan får jeg det til at sne?", "Ryst eller vip din iPhone, eller tryk på kuglen."],
    ["Hvordan sender jeg den?", "Åbn din kugle, og tryk på Send. Du kan dele et 12 sekunders videokort, et kvadratisk billede eller gemme et Live Photo."],
    ["Hvordan tilføjer jeg widgetten?", "Hold fingeren på hjemmeskærmen, tryk på Rediger, derefter Tilføj widget, og søg efter Globie. Med Christmas Pass viser widgetten din egen kugle."],
    ["Gendan mit køb", "Åbn købsskærmen eller Indstillinger, og tryk på Gendan køb. Christmas Pass virker på alle enheder med samme Apple-konto og med Familiedeling."],
    ["Kontakt", "Skriv til {EMAIL}, så svarer vi."]]],
  t: ["Brugsvilkår", "Gælder fra 23. november 2026", [
    ["Licens", "Globie licenseres til dig under Apples standardlicensaftale for slutbrugere (EULA): {EULA} — disse vilkår tilføjer kun nogle få punkter om Globie."],
    ["Christmas Pass", "Det er gratis at lave snekugler. Det valgfri Christmas Pass er et engangskøb i appen, ikke et abonnement. Det låser op for eksport af video og Live Photo, fjerner vandmærket og viser din egen kugle i widgetten. Du kan gendanne det på dine enheder med samme Apple-konto."],
    ["Betaling og refusion", "Alle betalinger håndteres af Apple. Refusioner håndteres af Apple efter Apples regler; du kan anmode om en her: {REFUND}"],
    ["Dit indhold", "Dine fotos og kugler bliver på din enhed og tilhører dig. Vi modtager, gemmer eller bruger dem aldrig. Brug kun fotos, du har ret til at bruge og dele."],
    ["Garanti", "Appen leveres ”som den er”, i det omfang loven tillader, som beskrevet i Apples EULA. Vi kan opdatere appen og vilkårene; datoen ovenfor viser den gældende version."],
    ["Kontakt", "{EMAIL}"]]],
});

L("nb", "Norsk", {
  nav: ["Personvern", "Støtte", "Vilkår", "Språk"],
  p: ["Personvernerklæring", "Gjelder fra 25. november 2026", [
    ["Kort fortalt", "Globie har ingen reklame, ingen kontoer og ingen sporing. Bildene dine forlater aldri iPhonen. Det eneste som forlater enheten, er det som trengs for kjøpet av Christmas Pass (se Kjøp)."],
    ["Bilder", "Du velger et bilde med systemets bildevelger, så Globie ser aldri resten av biblioteket ditt. Personen eller kjæledyret klippes ut på enheten din med Apples Vision-rammeverk. Bildet og snøkulene dine lagres bare i appen på iPhonen din. Ingenting lastes opp. For å lagre en video eller et bilde bes det bare om tilgang til å legge til i Bilder."],
    ["Widget og påminnelser", "Widgeten leser et lite bilde av kulen din fra appens lagring på enheten. Den valgfrie daglige påminnelsen er et lokalt varsel."],
    ["Kjøp", "Det valgfrie Christmas Pass er et engangskjøp i appen via Apple; vi ser aldri betalingsopplysningene dine. For å sjekke og gjenopprette kjøp bruker vi RevenueCat (https://www.revenuecat.com/privacy). Appen sender RevenueCat en tilfeldig anonym ID fra appen, kjøpene dine i appen, appversjonen og enhetens land og språk. Dette knyttes ikke til navnet ditt eller Apple-ID-en og brukes ikke til reklame eller sporing."],
    ["Tredjeparter", "Bortsett fra RevenueCat for kjøp finnes det ingen kode fra tredjeparter for reklame, analyse eller sosiale medier, og appen gjør ingen andre internettilkoblinger."],
    ["Dine rettigheter", "Vi lagrer ikke navn, e-post eller kontaktinformasjon. Den anonyme kjøpsposten slettes på forespørsel: skriv til {EMAIL}. Sletter du appen, slettes alle bilder og kuler; et kjøp blir på Apple-ID-en din og kan gjenopprettes."],
    ["Kontakt", "Spørsmål om personvern: {EMAIL}"]]],
  s: ["Støtte", "Globie", [
    ["Hvordan får jeg familien inn i kulen?", "Trykk på Bilde-knappen i redigeringen og velg et bilde. Personer og kjæledyr klippes ut automatisk; en rolig bakgrunn fungerer best. Hvis ingen blir funnet, legges bildet i en oval ramme."],
    ["Hvordan får jeg det til å snø?", "Rist eller vipp iPhonen, eller trykk på kulen."],
    ["Hvordan sender jeg den?", "Åpne kulen og trykk på Send. Du kan dele et videokort på 12 sekunder, et kvadratisk bilde eller lagre et Live Photo."],
    ["Hvordan legger jeg til widgeten?", "Hold fingeren på Hjem-skjermen, trykk på Rediger, så Legg til widget, og søk etter Globie. Med Christmas Pass viser widgeten din egen kule."],
    ["Gjenopprett kjøpet", "Åpne kjøpsskjermen eller Innstillinger og trykk på Gjenopprett kjøp. Christmas Pass virker på alle enheter med samme Apple-konto og med Familiedeling."],
    ["Kontakt", "Skriv til {EMAIL}, så svarer vi."]]],
  t: ["Bruksvilkår", "Gjelder fra 23. november 2026", [
    ["Lisens", "Globie lisensieres til deg under Apples standard lisensavtale for sluttbrukere (EULA): {EULA} — disse vilkårene legger bare til noen få punkter om Globie."],
    ["Christmas Pass", "Det er gratis å lage snøkuler. Det valgfrie Christmas Pass er et engangskjøp i appen, ikke et abonnement. Det låser opp eksport av video og Live Photo, fjerner vannmerket og viser din egen kule i widgeten. Du kan gjenopprette det på enhetene dine med samme Apple-konto."],
    ["Betaling og refusjon", "Alle betalinger håndteres av Apple. Refusjon håndteres av Apple etter Apples regler; du kan be om det her: {REFUND}"],
    ["Ditt innhold", "Bildene og kulene dine blir på enheten og tilhører deg. Vi mottar, lagrer eller bruker dem aldri. Bruk bare bilder du har rett til å bruke og dele."],
    ["Garanti", "Appen leveres «som den er», så langt loven tillater, som beskrevet i Apples EULA. Vi kan oppdatere appen og vilkårene; datoen over viser gjeldende versjon."],
    ["Kontakt", "{EMAIL}"]]],
});

L("fi", "Suomi", {
  nav: ["Tietosuoja", "Tuki", "Ehdot", "Kieli"],
  p: ["Tietosuojaseloste", "Voimassa 25.11.2026 alkaen", [
    ["Lyhyesti", "Globiessa ei ole mainoksia, tilejä eikä seurantaa. Kuvasi eivät koskaan poistu iPhonesta. Laitteelta lähtevät vain Christmas Passin ostoon tarvittavat tiedot (ks. Ostot)."],
    ["Kuvat", "Valitset kuvan järjestelmän kuvavalitsimella, joten Globie ei koskaan näe muuta kirjastoasi. Henkilö tai lemmikki rajataan laitteellasi Applen Vision-kehyksellä. Kuva ja lumisadepallosi tallennetaan vain apin sisälle iPhonessasi. Mitään ei ladata verkkoon. Videon tai kuvan tallennus pyytää vain lisäysoikeutta Kuviin."],
    ["Widget ja muistutukset", "Widget lukee pienen kuvan pallostasi apin tallennustilasta laitteellasi. Valinnainen päivittäinen muistutus on paikallinen ilmoitus."],
    ["Ostot", "Valinnainen Christmas Pass on Applen kautta tehtävä kertaosto; emme koskaan näe maksutietojasi. Ostojen tarkistamiseen ja palauttamiseen käytämme RevenueCatia (https://www.revenuecat.com/privacy). Sovellus lähettää RevenueCatille sovelluksen luoman satunnaisen nimettömän tunnisteen, ostosi sovelluksessa, sovelluksen version sekä laitteen maan ja kielen. Tietoja ei liitetä nimeesi tai Apple ID:hesi eikä käytetä mainontaan tai seurantaan."],
    ["Kolmannet osapuolet", "RevenueCatia lukuun ottamatta sovelluksessa ei ole kolmansien osapuolten mainos-, analytiikka- tai somekoodia, eikä sovellus muodosta muita internetyhteyksiä."],
    ["Oikeutesi", "Emme säilytä nimeä, sähköpostia tai yhteystietoja. Nimetön ostotieto poistetaan pyynnöstä: kirjoita osoitteeseen {EMAIL}. Sovelluksen poistaminen poistaa kaikki kuvat ja pallot; osto säilyy Apple ID:ssäsi ja voidaan palauttaa."],
    ["Yhteystiedot", "Tietosuojakysymykset: {EMAIL}"]]],
  s: ["Tuki", "Globie", [
    ["Miten saan perheeni palloon?", "Napauta editorissa Kuva-painiketta ja valitse kuva. Ihmiset ja lemmikit rajataan automaattisesti; tasainen tausta toimii parhaiten. Jos ketään ei löydy, kuva sijoitetaan soikeaan kehykseen."],
    ["Miten saan lumen sataamaan?", "Ravista tai kallista iPhonea tai napauta palloa."],
    ["Miten lähetän sen?", "Avaa pallosi ja napauta Lähetä. Voit jakaa 12 sekunnin videokortin tai neliökuvan tai tallentaa Live Photon."],
    ["Miten lisään widgetin?", "Paina pitkään Koti-valikkoa, napauta Muokkaa ja sitten Lisää widget ja hae Globie. Christmas Passin kanssa widget näyttää oman pallosi."],
    ["Palauta ostos", "Avaa ostonäkymä tai Asetukset ja napauta Palauta ostos. Christmas Pass toimii kaikilla laitteilla, joissa on sama Apple-tili, ja Perhejaossa."],
    ["Yhteystiedot", "Kirjoita osoitteeseen {EMAIL}, niin vastaamme."]]],
  t: ["Käyttöehdot", "Voimassa 23.11.2026 alkaen", [
    ["Lisenssi", "Globie lisensoidaan sinulle Applen vakiomuotoisen loppukäyttäjän lisenssisopimuksen (EULA) mukaisesti: {EULA} — nämä ehdot lisäävät vain muutaman Globieta koskevan kohdan."],
    ["Christmas Pass", "Lumisadepallojen tekeminen on ilmaista. Valinnainen Christmas Pass on kertaluonteinen sovelluksen sisäinen osto, ei tilaus. Se avaa videon ja Live Photon viennin, poistaa vesileiman ja näyttää oman pallosi widgetissä. Voit palauttaa sen laitteillesi samalla Apple-tilillä."],
    ["Maksut ja hyvitykset", "Apple käsittelee kaikki maksut. Hyvitykset hoitaa Apple omien sääntöjensä mukaan; voit pyytää hyvitystä täältä: {REFUND}"],
    ["Sisältösi", "Kuvasi ja pallosi pysyvät laitteellasi ja ovat sinun. Emme koskaan vastaanota, tallenna tai käytä niitä. Käytä vain kuvia, joiden käyttöön ja jakamiseen sinulla on oikeus."],
    ["Takuu", "Appi toimitetaan ”sellaisenaan” lain sallimissa rajoissa Applen EULA:n mukaisesti. Voimme päivittää appia ja näitä ehtoja; yllä oleva päivämäärä kertoo voimassa olevan version."],
    ["Yhteystiedot", "{EMAIL}"]]],
});

L("pl", "Polski", {
  nav: ["Prywatność", "Pomoc", "Warunki", "Język"],
  p: ["Polityka prywatności", "Obowiązuje od 25 listopada 2026", [
    ["W skrócie", "Globie nie ma reklam, kont ani śledzenia. Twoje zdjęcia nigdy nie opuszczają iPhone’a. Z urządzenia wychodzą tylko dane potrzebne do zakupu Christmas Pass (zob. Zakupy)."],
    ["Zdjęcia", "Zdjęcie wybierasz systemowym selektorem, więc Globie nigdy nie widzi reszty biblioteki. Osoba lub zwierzak jest wycinany na urządzeniu za pomocą frameworka Vision od Apple. Zdjęcie i Twoje kule śnieżne są przechowywane tylko w aplikacji na iPhonie. Nic nie jest wysyłane. Przy zapisie wideo lub obrazu prosimy tylko o dostęp do dodawania w Zdjęciach."],
    ["Widżet i przypomnienia", "Widżet odczytuje mały obraz kuli z pamięci aplikacji na urządzeniu. Opcjonalne codzienne przypomnienie to lokalne powiadomienie."],
    ["Zakupy", "Opcjonalny Christmas Pass to jednorazowy zakup w aplikacji obsługiwany przez Apple; nigdy nie widzimy danych płatności. Do sprawdzania i przywracania zakupów używamy RevenueCat (https://www.revenuecat.com/privacy). Aplikacja wysyła do RevenueCat losowy anonimowy identyfikator utworzony przez aplikację, Twoje zakupy w aplikacji, wersję aplikacji oraz kraj i język urządzenia. Nie są one powiązane z Twoim imieniem ani Apple ID i nie służą do reklam ani śledzenia."],
    ["Podmioty trzecie", "Poza RevenueCat do zakupów w aplikacji nie ma kodu firm trzecich do reklam, analityki ani mediów społecznościowych, a aplikacja nie nawiązuje innych połączeń z internetem."],
    ["Twoje prawa", "Nie przechowujemy imienia, e-maila ani danych kontaktowych. Anonimowy zapis zakupu usuwamy na prośbę: napisz na {EMAIL}. Usunięcie aplikacji kasuje wszystkie zdjęcia i kule; zakup zostaje przy Twoim Apple ID i można go przywrócić."],
    ["Kontakt", "Pytania o prywatność: {EMAIL}"]]],
  s: ["Pomoc", "Globie", [
    ["Jak umieścić rodzinę w kuli?", "W edytorze stuknij przycisk Zdjęcie i wybierz zdjęcie. Osoby i zwierzęta są wycinane automatycznie; najlepiej działa jednolite tło. Jeśli nikt nie zostanie znaleziony, zdjęcie trafi do owalnej ramki."],
    ["Jak sprawić, by padał śnieg?", "Potrząśnij lub przechyl iPhone'a albo stuknij kulę."],
    ["Jak ją wysłać?", "Otwórz kulę i stuknij Wyślij. Możesz udostępnić 12-sekundową kartkę wideo, kwadratowy obraz lub zapisać Live Photo."],
    ["Jak dodać widżet?", "Przytrzymaj ekran początkowy, stuknij Edycja, potem Dodaj widżet i wyszukaj Globie. Z Christmas Pass widżet pokazuje Twoją kulę."],
    ["Przywróć zakup", "Otwórz ekran zakupu lub Ustawienia i stuknij Przywróć zakup. Christmas Pass działa na wszystkich urządzeniach z tym samym kontem Apple i w Chmurze rodzinnej."],
    ["Kontakt", "Napisz na {EMAIL}, odpowiemy."]]],
  t: ["Warunki korzystania", "Obowiązują od 23 listopada 2026", [
    ["Licencja", "Globie jest licencjonowane na podstawie standardowej umowy licencyjnej użytkownika końcowego Apple (EULA): {EULA} — te warunki dodają tylko kilka punktów dotyczących Globie."],
    ["Christmas Pass", "Tworzenie kul śnieżnych jest bezpłatne. Opcjonalny Christmas Pass to jednorazowy zakup w aplikacji, a nie subskrypcja. Odblokowuje eksport wideo i Live Photo, usuwa znak wodny i pokazuje Twoją kulę w widżecie. Możesz go przywrócić na swoich urządzeniach z tym samym kontem Apple."],
    ["Płatności i zwroty", "Wszystkie płatności obsługuje Apple. Zwroty obsługuje Apple zgodnie ze swoimi zasadami; możesz o nie poprosić tutaj: {REFUND}"],
    ["Twoje treści", "Twoje zdjęcia i kule zostają na urządzeniu i należą do Ciebie. Nigdy ich nie otrzymujemy, nie przechowujemy ani nie wykorzystujemy. Używaj tylko zdjęć, do których masz prawo."],
    ["Gwarancja", "Aplikacja jest udostępniana „w stanie, w jakim jest”, w zakresie dozwolonym przez prawo, zgodnie z EULA Apple. Możemy aktualizować aplikację i te warunki; data powyżej wskazuje obowiązującą wersję."],
    ["Kontakt", "{EMAIL}"]]],
});

L("cs", "Čeština", {
  nav: ["Soukromí", "Podpora", "Podmínky", "Jazyk"],
  p: ["Zásady ochrany soukromí", "Platné od 25. listopadu 2026", [
    ["Shrnutí", "Globie nemá reklamy, účty ani sledování. Tvoje fotky nikdy neopustí iPhone. Zařízení opouštějí jen data nutná pro nákup Christmas Pass (viz Nákupy)."],
    ["Fotky", "Fotku vybíráte systémovým výběrem, takže Globie nikdy nevidí zbytek vaší knihovny. Osoba nebo zvíře se vyřízne přímo v zařízení pomocí frameworku Vision od Applu. Fotka a vaše sněžítka se ukládají jen v aplikaci ve vašem iPhonu. Nic se nenahrává. Při ukládání videa nebo obrázku se žádá jen o přístup k přidávání do Fotek."],
    ["Widget a připomínky", "Widget čte malý obrázek vašeho sněžítka z úložiště aplikace v zařízení. Volitelná denní připomínka je místní oznámení."],
    ["Nákupy", "Volitelný Christmas Pass je jednorázový nákup v aplikaci přes Apple; tvé platební údaje nikdy nevidíme. Ke kontrole a obnově nákupů používáme RevenueCat (https://www.revenuecat.com/privacy). Aplikace posílá RevenueCatu náhodné anonymní ID vytvořené aplikací, tvé nákupy v aplikaci, verzi aplikace a zemi a jazyk zařízení. Nejsou spojeny s tvým jménem ani Apple ID a nepoužívají se k reklamě ani sledování."],
    ["Třetí strany", "Kromě RevenueCat pro nákupy v aplikaci není žádný kód třetích stran pro reklamu, analytiku ani sociální sítě a aplikace nenavazuje jiná internetová spojení."],
    ["Vaše práva", "Neuchováváme jméno, e-mail ani kontakty. Anonymní záznam o nákupu na požádání smažeme: napiš na {EMAIL}. Smazání aplikace odstraní všechny fotky a koule; nákup zůstává u tvého Apple ID a lze ho obnovit."],
    ["Kontakt", "Dotazy k soukromí: {EMAIL}"]]],
  s: ["Podpora", "Globie", [
    ["Jak dostanu rodinu do sněžítka?", "V editoru klepněte na tlačítko Fotka a vyberte fotku. Lidé a zvířata se vyříznou automaticky; nejlépe funguje jednolité pozadí. Pokud nikdo není nalezen, fotka se vloží do oválného rámečku."],
    ["Jak udělám, aby sněžilo?", "Zatřeste nebo nakloňte iPhone, případně klepněte na sněžítko."],
    ["Jak ho pošlu?", "Otevřete sněžítko a klepněte na Odeslat. Můžete sdílet 12sekundové video přání, čtvercový obrázek nebo uložit Live Photo."],
    ["Jak přidám widget?", "Podržte prst na ploše, klepněte na Upravit, pak Přidat widget a vyhledejte Globie. S Christmas Pass zobrazuje widget vaše vlastní sněžítko."],
    ["Obnovit nákup", "Otevřete obrazovku nákupu nebo Nastavení a klepněte na Obnovit nákup. Christmas Pass funguje na všech zařízeních se stejným účtem Apple a v rodinném sdílení."],
    ["Kontakt", "Napište na {EMAIL}, odpovíme."]]],
  t: ["Podmínky použití", "Platné od 23. listopadu 2026", [
    ["Licence", "Globie je vám licencováno podle standardní licenční smlouvy s koncovým uživatelem společnosti Apple (EULA): {EULA} — tyto podmínky jen doplňují několik bodů o Globie."],
    ["Christmas Pass", "Vytváření sněžítek je zdarma. Volitelný Christmas Pass je jednorázový nákup v aplikaci, ne předplatné. Odemyká export videa a Live Photo, odstraňuje vodoznak a zobrazuje vaše sněžítko ve widgetu. Můžete ho obnovit na svých zařízeních se stejným účtem Apple."],
    ["Platby a vrácení peněz", "Všechny platby zpracovává Apple. Vrácení peněz řeší Apple podle svých pravidel; požádat můžete zde: {REFUND}"],
    ["Váš obsah", "Vaše fotky a sněžítka zůstávají ve vašem zařízení a patří vám. Nikdy je nepřijímáme, neukládáme ani nepoužíváme. Používejte jen fotky, které smíte používat a sdílet."],
    ["Záruka", "Aplikace se poskytuje „tak, jak je“, v rozsahu povoleném zákonem, jak popisuje EULA Applu. Aplikaci i tyto podmínky můžeme aktualizovat; datum výše uvádí platnou verzi."],
    ["Kontakt", "{EMAIL}"]]],
});

L("sk", "Slovenčina", {
  nav: ["Súkromie", "Podpora", "Podmienky", "Jazyk"],
  p: ["Zásady ochrany súkromia", "Platné od 25. novembra 2026", [
    ["Zhrnutie", "Globie nemá reklamy, účty ani sledovanie. Tvoje fotky nikdy neopustia iPhone. Zariadenie opúšťajú len údaje potrebné na nákup Christmas Pass (pozri Nákupy)."],
    ["Fotky", "Fotku vyberáte systémovým výberom, takže Globie nikdy nevidí zvyšok vašej knižnice. Osoba alebo zviera sa vyreže priamo v zariadení pomocou frameworku Vision od Apple. Fotka a vaše snehové gule sa ukladajú len v aplikácii vo vašom iPhone. Nič sa nenahráva. Pri ukladaní videa alebo obrázka sa žiada len o prístup na pridávanie do Fotiek."],
    ["Widget a pripomienky", "Widget číta malý obrázok vašej gule z úložiska aplikácie v zariadení. Voliteľná denná pripomienka je lokálne upozornenie."],
    ["Nákupy", "Voliteľný Christmas Pass je jednorazový nákup v aplikácii cez Apple; tvoje platobné údaje nikdy nevidíme. Na kontrolu a obnovu nákupov používame RevenueCat (https://www.revenuecat.com/privacy). Aplikácia posiela RevenueCatu náhodné anonymné ID vytvorené aplikáciou, tvoje nákupy v aplikácii, verziu aplikácie a krajinu a jazyk zariadenia. Nie sú prepojené s tvojím menom ani Apple ID a nepoužívajú sa na reklamu ani sledovanie."],
    ["Tretie strany", "Okrem RevenueCat pre nákupy v aplikácii nie je žiadny kód tretích strán pre reklamu, analytiku ani sociálne siete a aplikácia nenadväzuje iné internetové spojenia."],
    ["Vaše práva", "Neuchovávame meno, e-mail ani kontakty. Anonymný záznam o nákupe na požiadanie vymažeme: napíš na {EMAIL}. Vymazanie aplikácie odstráni všetky fotky a gule; nákup zostáva pri tvojom Apple ID a dá sa obnoviť."],
    ["Kontakt", "Otázky o súkromí: {EMAIL}"]]],
  s: ["Podpora", "Globie", [
    ["Ako dostanem rodinu do gule?", "V editore klepnite na tlačidlo Fotka a vyberte fotku. Ľudia a zvieratá sa vyrežú automaticky; najlepšie funguje jednofarebné pozadie. Ak sa nikto nenájde, fotka sa vloží do oválneho rámika."],
    ["Ako spravím, aby snežilo?", "Zatraste alebo nakloňte iPhone, prípadne klepnite na guľu."],
    ["Ako ju pošlem?", "Otvorte guľu a klepnite na Odoslať. Môžete zdieľať 12-sekundové video prianie, štvorcový obrázok alebo uložiť Live Photo."],
    ["Ako pridám widget?", "Podržte prst na ploche, klepnite na Upraviť, potom Pridať widget a vyhľadajte Globie. S Christmas Pass zobrazuje widget vašu vlastnú guľu."],
    ["Obnoviť nákup", "Otvorte obrazovku nákupu alebo Nastavenia a klepnite na Obnoviť nákup. Christmas Pass funguje na všetkých zariadeniach s rovnakým účtom Apple a v Rodinnom zdieľaní."],
    ["Kontakt", "Napíšte na {EMAIL}, odpovieme."]]],
  t: ["Podmienky používania", "Platné od 23. novembra 2026", [
    ["Licencia", "Globie vám je licencované podľa štandardnej licenčnej zmluvy s koncovým používateľom spoločnosti Apple (EULA): {EULA} — tieto podmienky len dopĺňajú niekoľko bodov o Globie."],
    ["Christmas Pass", "Vytváranie snehových gúľ je zadarmo. Voliteľný Christmas Pass je jednorazový nákup v aplikácii, nie predplatné. Odomyká export videa a Live Photo, odstraňuje vodoznak a zobrazuje vašu guľu vo widgete. Môžete ho obnoviť na svojich zariadeniach s rovnakým účtom Apple."],
    ["Platby a vrátenie peňazí", "Všetky platby spracúva Apple. Vrátenie peňazí rieši Apple podľa svojich pravidiel; požiadať môžete tu: {REFUND}"],
    ["Váš obsah", "Vaše fotky a gule zostávajú vo vašom zariadení a patria vám. Nikdy ich neprijímame, neukladáme ani nepoužívame. Používajte len fotky, ktoré smiete používať a zdieľať."],
    ["Záruka", "Aplikácia sa poskytuje „tak, ako je“, v rozsahu povolenom zákonom, ako opisuje EULA Apple. Aplikáciu aj tieto podmienky môžeme aktualizovať; dátum vyššie uvádza platnú verziu."],
    ["Kontakt", "{EMAIL}"]]],
});

L("hu", "Magyar", {
  nav: ["Adatvédelem", "Támogatás", "Feltételek", "Nyelv"],
  p: ["Adatvédelmi irányelvek", "Hatályos: 2026. november 25-tól", [
    ["Összefoglaló", "A Globie-ban nincs reklám, fiók és követés. A fotóid sosem hagyják el az iPhone-odat. Csak a Christmas Pass vásárlásához szükséges adatok hagyják el a készüléket (lásd Vásárlások)."],
    ["Fotók", "A fotót a rendszer fotóválasztójával választod ki, így a Globie soha nem látja a könyvtárad többi részét. A személyt vagy háziállatot az eszközödön vágja ki az Apple Vision keretrendszere. A fotó és a hógömbjeid csak az appon belül tárolódnak az iPhone-odon. Semmi nem töltődik fel. Videó vagy kép mentésekor csak hozzáadási engedélyt kérünk a Fotókhoz."],
    ["Widget és emlékeztetők", "A widget a gömböd egy kis képét olvassa az app tárhelyéről az eszközön. A választható napi emlékeztető helyi értesítés."],
    ["Vásárlás", "Az opcionális Christmas Pass egyszeri, Apple által kezelt alkalmazáson belüli vásárlás; a fizetési adataidat sosem látjuk. A vásárlások ellenőrzéséhez és visszaállításához a RevenueCatet használjuk (https://www.revenuecat.com/privacy). Az app egy általa létrehozott véletlen, névtelen azonosítót, az appban tett vásárlásaidat, az app verzióját, valamint a készülék országát és nyelvét küldi a RevenueCatnek. Ezek nem kapcsolódnak a nevedhez vagy Apple ID-dhoz, és nem használjuk őket hirdetésre vagy követésre."],
    ["Harmadik felek", "A vásárlásokhoz használt RevenueCaten kívül nincs az appban harmadik féltől származó reklám-, elemző vagy közösségimédia-kód, és az app nem létesít más internetkapcsolatot."],
    ["Jogaid", "Nem tárolunk nevet, e-mailt vagy elérhetőséget. A névtelen vásárlási rekordot kérésre töröljük: írj a(z) {EMAIL} címre. Az app törlése minden fotót és gömböt töröl; a vásárlás az Apple ID-dnál marad, és visszaállítható."],
    ["Kapcsolat", "Adatvédelmi kérdések: {EMAIL}"]]],
  s: ["Támogatás", "Globie", [
    ["Hogyan teszem a családomat a gömbbe?", "A szerkesztőben koppints a Fotó gombra, és válassz egy fotót. Az embereket és állatokat automatikusan kivágja; egyszerű háttérrel működik a legjobban. Ha senkit nem talál, a fotó ovális keretbe kerül."],
    ["Hogyan esik a hó?", "Rázd meg vagy döntsd meg az iPhone-t, vagy koppints a gömbre."],
    ["Hogyan küldöm el?", "Nyisd meg a gömböt, és koppints a Küldés gombra. Megoszthatsz egy 12 másodperces videós képeslapot, egy négyzetes képet, vagy menthetsz egy Live Photót."],
    ["Hogyan adom hozzá a widgetet?", "Tartsd lenyomva a Főképernyőt, koppints a Szerkesztés, majd a Widget hozzáadása elemre, és keress rá a Globie-ra. A Christmas Passszal a widget a saját gömbödet mutatja."],
    ["Vásárlás visszaállítása", "Nyisd meg a vásárlási képernyőt vagy a Beállításokat, és koppints a Vásárlás visszaállítása gombra. A Christmas Pass minden eszközön működik ugyanazzal az Apple-fiókkal és a Családi megosztásban."],
    ["Kapcsolat", "Írj a {EMAIL} címre, válaszolunk."]]],
  t: ["Felhasználási feltételek", "Hatályos: 2026. november 23-tól", [
    ["Licenc", "A Globie-t az Apple szabványos végfelhasználói licencszerződése (EULA) alapján kapod: {EULA} — ezek a feltételek csak néhány Globie-ra vonatkozó pontot egészítenek ki."],
    ["Christmas Pass", "A hógömbök készítése ingyenes. A választható Christmas Pass egyszeri alkalmazáson belüli vásárlás, nem előfizetés. Feloldja a videó- és Live Photo-exportot, eltávolítja a vízjelet, és a saját gömbödet mutatja a widgeten. Visszaállíthatod az eszközeiden ugyanazzal az Apple-fiókkal."],
    ["Fizetés és visszatérítés", "Minden fizetést az Apple kezel. A visszatérítést az Apple intézi a saját szabályai szerint; itt kérheted: {REFUND}"],
    ["A tartalmad", "A fotóid és gömbjeid az eszközödön maradnak, és a tieid. Soha nem kapjuk meg, tároljuk vagy használjuk őket. Csak olyan fotót használj, amelyhez jogod van."],
    ["Szavatosság", "Az appot a törvény által megengedett mértékben „ahogy van” alapon biztosítjuk, az Apple EULA szerint. Az appot és a feltételeket frissíthetjük; a fenti dátum a hatályos változatot mutatja."],
    ["Kapcsolat", "{EMAIL}"]]],
});

L("ro", "Română", {
  nav: ["Confidențialitate", "Asistență", "Termeni", "Limbă"],
  p: ["Politica de confidențialitate", "În vigoare din 25 noiembrie 2026", [
    ["Pe scurt", "Globie nu are reclame, conturi sau urmărire. Pozele tale nu părăsesc niciodată iPhone-ul. Din dispozitiv pleacă doar datele necesare pentru achiziția Christmas Pass (vezi Achiziții)."],
    ["Fotografii", "Alegi o fotografie cu selectorul sistemului, așa că Globie nu vede niciodată restul bibliotecii. Persoana sau animalul este decupat pe dispozitiv cu framework-ul Vision de la Apple. Fotografia și globurile tale sunt stocate doar în aplicație, pe iPhone. Nimic nu este încărcat. Pentru salvarea unui video sau a unei imagini se cere doar acces de adăugare în Poze."],
    ["Widget și mementouri", "Widgetul citește o imagine mică a globului din spațiul aplicației de pe dispozitiv. Mementoul zilnic opțional este o notificare locală."],
    ["Achiziții", "Christmas Pass opțional este o achiziție unică în aplicație gestionată de Apple; nu vedem niciodată datele tale de plată. Pentru verificarea și restaurarea achizițiilor folosim RevenueCat (https://www.revenuecat.com/privacy). Aplicația trimite către RevenueCat un ID anonim aleatoriu creat de aplicație, achizițiile tale din aplicație, versiunea aplicației și țara și limba dispozitivului. Acestea nu sunt legate de numele tău sau de ID-ul Apple și nu sunt folosite pentru reclame sau urmărire."],
    ["Terți", "În afară de RevenueCat pentru achiziții, aplicația nu conține cod terț de reclame, analiză sau rețele sociale și nu face alte conexiuni la internet."],
    ["Drepturile tale", "Nu păstrăm nume, e-mail sau date de contact. Înregistrarea anonimă a achiziției se șterge la cerere: scrie la {EMAIL}. Ștergerea aplicației șterge toate pozele și globurile; achiziția rămâne pe ID-ul tău Apple și poate fi restaurată."],
    ["Contact", "Întrebări despre confidențialitate: {EMAIL}"]]],
  s: ["Asistență", "Globie", [
    ["Cum îmi pun familia în glob?", "În editor, atinge butonul Foto și alege o fotografie. Persoanele și animalele sunt decupate automat; un fundal simplu funcționează cel mai bine. Dacă nu este găsit nimeni, fotografia este pusă într-o ramă ovală."],
    ["Cum fac să ningă?", "Scutură sau înclină iPhone-ul ori atinge globul."],
    ["Cum îl trimit?", "Deschide globul și atinge Trimite. Poți partaja o felicitare video de 12 secunde, o imagine pătrată sau poți salva o Live Photo."],
    ["Cum adaug widgetul?", "Ține apăsat pe ecranul principal, atinge Editează, apoi Adaugă widget și caută Globie. Cu Christmas Pass, widgetul arată propriul tău glob."],
    ["Restaurează achiziția", "Deschide ecranul de achiziție sau Configurări și atinge Restaurează achiziția. Christmas Pass funcționează pe toate dispozitivele cu același cont Apple și cu Partajarea familială."],
    ["Contact", "Scrie-ne la {EMAIL} și îți răspundem."]]],
  t: ["Termeni de utilizare", "În vigoare din 23 noiembrie 2026", [
    ["Licență", "Globie îți este licențiat conform Acordului de licență standard pentru utilizatorul final al Apple (EULA): {EULA} — acești termeni adaugă doar câteva puncte despre Globie."],
    ["Christmas Pass", "Crearea globurilor de zăpadă este gratuită. Christmas Pass opțional este o achiziție unică în aplicație, nu un abonament. Deblochează exportul video și Live Photo, elimină filigranul și arată globul tău în widget. Îl poți restaura pe dispozitivele tale cu același cont Apple."],
    ["Plăți și rambursări", "Toate plățile sunt procesate de Apple. Rambursările sunt gestionate de Apple conform regulilor sale; poți solicita una aici: {REFUND}"],
    ["Conținutul tău", "Fotografiile și globurile tale rămân pe dispozitiv și îți aparțin. Nu le primim, nu le stocăm și nu le folosim niciodată. Folosește doar fotografii pe care ai dreptul să le folosești și să le partajezi."],
    ["Garanție", "Aplicația este oferită „ca atare”, în limitele permise de lege, conform EULA Apple. Putem actualiza aplicația și acești termeni; data de mai sus arată versiunea în vigoare."],
    ["Contact", "{EMAIL}"]]],
});

L("hr", "Hrvatski", {
  nav: ["Privatnost", "Podrška", "Uvjeti", "Jezik"],
  p: ["Pravila privatnosti", "Na snazi od 25. studenoga 2026.", [
    ["Ukratko", "Globie nema oglasa, računa ni praćenja. Tvoje fotografije nikad ne napuštaju iPhone. Uređaj napuštaju samo podaci potrebni za kupnju Christmas Passa (vidi Kupnje)."],
    ["Fotografije", "Fotografiju birate sistemskim odabirom, pa Globie nikad ne vidi ostatak vaše knjižnice. Osoba ili ljubimac izrezuje se na uređaju pomoću Appleova okvira Vision. Fotografija i vaše snježne kugle spremaju se samo u aplikaciji na iPhoneu. Ništa se ne učitava na internet. Za spremanje videa ili slike traži se samo pristup za dodavanje u Fotografije."],
    ["Widget i podsjetnici", "Widget čita malu sliku vaše kugle iz spremišta aplikacije na uređaju. Neobavezni dnevni podsjetnik lokalna je obavijest."],
    ["Kupnje", "Opcionalni Christmas Pass jednokratna je kupnja u aplikaciji preko Applea; tvoje podatke o plaćanju nikad ne vidimo. Za provjeru i vraćanje kupnji koristimo RevenueCat (https://www.revenuecat.com/privacy). Aplikacija RevenueCatu šalje nasumični anonimni ID koji stvara aplikacija, tvoje kupnje u aplikaciji, verziju aplikacije te zemlju i jezik uređaja. To nije povezano s tvojim imenom ni Apple ID-jem i ne koristi se za oglase ni praćenje."],
    ["Treće strane", "Osim RevenueCata za kupnje, u aplikaciji nema koda trećih strana za oglase, analitiku ni društvene mreže, a aplikacija ne uspostavlja druge internetske veze."],
    ["Vaša prava", "Ne čuvamo ime, e-poštu ni kontakt podatke. Anonimni zapis o kupnji brišemo na zahtjev: piši na {EMAIL}. Brisanje aplikacije briše sve fotografije i kugle; kupnja ostaje uz tvoj Apple ID i može se vratiti."],
    ["Kontakt", "Pitanja o privatnosti: {EMAIL}"]]],
  s: ["Podrška", "Globie", [
    ["Kako staviti obitelj u kuglu?", "U uređivaču dodirnite tipku Fotografija i odaberite fotografiju. Osobe i ljubimci izrezuju se automatski; najbolje radi jednostavna pozadina. Ako nitko nije pronađen, fotografija ide u ovalni okvir."],
    ["Kako da pada snijeg?", "Protresite ili nagnite iPhone ili dodirnite kuglu."],
    ["Kako je poslati?", "Otvorite kuglu i dodirnite Pošalji. Možete podijeliti video čestitku od 12 sekundi, kvadratnu sliku ili spremiti Live Photo."],
    ["Kako dodati widget?", "Zadržite prst na početnom zaslonu, dodirnite Uredi, zatim Dodaj widget i potražite Globie. S Christmas Passom widget prikazuje vašu kuglu."],
    ["Vrati kupnju", "Otvorite zaslon kupnje ili Postavke i dodirnite Vrati kupnju. Christmas Pass radi na svim uređajima s istim Apple računom i u Obiteljskom dijeljenju."],
    ["Kontakt", "Pišite na {EMAIL}, odgovorit ćemo."]]],
  t: ["Uvjeti korištenja", "Na snazi od 23. studenoga 2026.", [
    ["Licenca", "Globie vam je licenciran prema Appleovu standardnom licencnom ugovoru s krajnjim korisnikom (EULA): {EULA} — ovi uvjeti samo dodaju nekoliko točaka o Globieju."],
    ["Christmas Pass", "Izrada snježnih kugli je besplatna. Neobavezni Christmas Pass jednokratna je kupnja unutar aplikacije, a ne pretplata. Otključava izvoz videa i Live Photo, uklanja vodeni žig i prikazuje vašu kuglu u widgetu. Možete ga vratiti na svojim uređajima s istim Apple računom."],
    ["Plaćanje i povrat novca", "Sva plaćanja obrađuje Apple. Povrat novca rješava Apple prema svojim pravilima; možete ga zatražiti ovdje: {REFUND}"],
    ["Vaš sadržaj", "Vaše fotografije i kugle ostaju na uređaju i pripadaju vama. Nikad ih ne primamo, ne spremamo niti koristimo. Koristite samo fotografije koje smijete koristiti i dijeliti."],
    ["Jamstvo", "Aplikacija se pruža „kakva jest”, u mjeri dopuštenoj zakonom, kako je opisano u Appleovu EULA-u. Aplikaciju i ove uvjete možemo ažurirati; datum gore prikazuje važeću verziju."],
    ["Kontakt", "{EMAIL}"]]],
});

L("el", "Ελληνικά", {
  nav: ["Απόρρητο", "Υποστήριξη", "Όροι", "Γλώσσα"],
  p: ["Πολιτική απορρήτου", "Ισχύει από 25 Νοεμβρίου 2026", [
    ["Συνοπτικά", "Το Globie δεν έχει διαφημίσεις, λογαριασμούς ή παρακολούθηση. Οι φωτογραφίες σου δεν φεύγουν ποτέ από το iPhone. Από τη συσκευή φεύγουν μόνο όσα χρειάζονται για την αγορά του Christmas Pass (δες Αγορές)."],
    ["Φωτογραφίες", "Επιλέγετε φωτογραφία με τον επιλογέα του συστήματος, οπότε το Globie δεν βλέπει ποτέ την υπόλοιπη βιβλιοθήκη σας. Το άτομο ή το κατοικίδιο αποκόπτεται στη συσκευή σας με το Vision της Apple. Η φωτογραφία και οι χιονόμπαλές σας αποθηκεύονται μόνο μέσα στην εφαρμογή στο iPhone σας. Τίποτα δεν ανεβαίνει. Για αποθήκευση βίντεο ή εικόνας ζητείται μόνο άδεια προσθήκης στις Φωτογραφίες."],
    ["Widget και υπενθυμίσεις", "Το widget διαβάζει μια μικρή εικόνα της μπάλας σας από τον χώρο της εφαρμογής στη συσκευή. Η προαιρετική ημερήσια υπενθύμιση είναι τοπική ειδοποίηση."],
    ["Αγορές", "Το προαιρετικό Christmas Pass είναι εφάπαξ αγορά εντός εφαρμογής μέσω Apple· δεν βλέπουμε ποτέ τα στοιχεία πληρωμής σου. Για τον έλεγχο και την επαναφορά αγορών χρησιμοποιούμε το RevenueCat (https://www.revenuecat.com/privacy). Η εφαρμογή στέλνει στο RevenueCat ένα τυχαίο ανώνυμο αναγνωριστικό που δημιουργεί η ίδια, τις αγορές σου στην εφαρμογή, την έκδοσή της και τη χώρα και γλώσσα της συσκευής. Αυτά δεν συνδέονται με το όνομά σου ή το Apple ID και δεν χρησιμοποιούνται για διαφήμιση ή παρακολούθηση."],
    ["Τρίτοι", "Πέρα από το RevenueCat για τις αγορές, η εφαρμογή δεν έχει κώδικα τρίτων για διαφήμιση, αναλύσεις ή μέσα κοινωνικής δικτύωσης και δεν κάνει άλλες συνδέσεις στο διαδίκτυο."],
    ["Τα δικαιώματά σας", "Δεν κρατάμε όνομα, email ή στοιχεία επικοινωνίας. Το ανώνυμο αρχείο αγοράς διαγράφεται κατόπιν αιτήματος: γράψε στο {EMAIL}. Η διαγραφή της εφαρμογής σβήνει όλες τις φωτογραφίες και τις χιονόμπαλες· η αγορά μένει στο Apple ID σου και μπορεί να επαναφερθεί."],
    ["Επικοινωνία", "Ερωτήσεις για το απόρρητο: {EMAIL}"]]],
  s: ["Υποστήριξη", "Globie", [
    ["Πώς βάζω την οικογένειά μου στη μπάλα;", "Στον επεξεργαστή πατήστε το κουμπί Φωτογραφία και επιλέξτε μια φωτογραφία. Άτομα και κατοικίδια αποκόπτονται αυτόματα· ένα απλό φόντο δουλεύει καλύτερα. Αν δεν βρεθεί κανείς, η φωτογραφία μπαίνει σε οβάλ κορνίζα."],
    ["Πώς χιονίζει;", "Κουνήστε ή γείρετε το iPhone ή πατήστε τη μπάλα."],
    ["Πώς τη στέλνω;", "Ανοίξτε τη μπάλα σας και πατήστε Αποστολή. Μπορείτε να μοιραστείτε μια κάρτα βίντεο 12 δευτερολέπτων, μια τετράγωνη εικόνα ή να αποθηκεύσετε ένα Live Photo."],
    ["Πώς προσθέτω το widget;", "Αγγίξτε παρατεταμένα την οθόνη Αφετηρίας, πατήστε Επεξεργασία, μετά Προσθήκη widget και αναζητήστε Globie. Με το Christmas Pass το widget δείχνει τη δική σας μπάλα."],
    ["Επαναφορά αγοράς", "Ανοίξτε την οθόνη αγοράς ή τις Ρυθμίσεις και πατήστε Επαναφορά αγοράς. Το Christmas Pass ισχύει σε όλες τις συσκευές με τον ίδιο λογαριασμό Apple και με την Οικογενειακή κοινή χρήση."],
    ["Επικοινωνία", "Γράψτε στο {EMAIL} και θα σας απαντήσουμε."]]],
  t: ["Όροι χρήσης", "Ισχύουν από 23 Νοεμβρίου 2026", [
    ["Άδεια", "Το Globie σας παραχωρείται με την Τυπική Άδεια Χρήσης Τελικού Χρήστη της Apple (EULA): {EULA} — οι παρόντες όροι προσθέτουν μόνο λίγα σημεία για το Globie."],
    ["Christmas Pass", "Η δημιουργία χιονόμπαλων είναι δωρεάν. Το προαιρετικό Christmas Pass είναι εφάπαξ αγορά εντός εφαρμογής, όχι συνδρομή. Ξεκλειδώνει εξαγωγή βίντεο και Live Photo, αφαιρεί το υδατόσημο και δείχνει τη μπάλα σας στο widget. Μπορείτε να το επαναφέρετε στις συσκευές σας με τον ίδιο λογαριασμό Apple."],
    ["Πληρωμές και επιστροφές", "Όλες οι πληρωμές γίνονται μέσω της Apple. Τις επιστροφές χρημάτων τις χειρίζεται η Apple κατά τους κανόνες της· μπορείτε να ζητήσετε εδώ: {REFUND}"],
    ["Το περιεχόμενό σας", "Οι φωτογραφίες και οι μπάλες σας μένουν στη συσκευή σας και σας ανήκουν. Δεν τις λαμβάνουμε, δεν τις αποθηκεύουμε και δεν τις χρησιμοποιούμε ποτέ. Χρησιμοποιείτε μόνο φωτογραφίες που έχετε δικαίωμα να χρησιμοποιείτε και να μοιράζεστε."],
    ["Εγγύηση", "Η εφαρμογή παρέχεται «ως έχει», στον βαθμό που επιτρέπει ο νόμος, όπως περιγράφει η EULA της Apple. Μπορούμε να ενημερώνουμε την εφαρμογή και τους όρους· η ημερομηνία επάνω δείχνει την ισχύουσα έκδοση."],
    ["Επικοινωνία", "{EMAIL}"]]],
});

L("ru", "Русский", {
  nav: ["Конфиденциальность", "Поддержка", "Условия", "Язык"],
  p: ["Политика конфиденциальности", "Действует с 25 ноября 2026 г.", [
    ["Кратко", "В Globie нет рекламы, аккаунтов и отслеживания. Ваши фото никогда не покидают iPhone. С устройства уходят только данные, нужные для покупки Christmas Pass (см. Покупки)."],
    ["Фото", "Вы выбираете фото через системное окно выбора, поэтому Globie никогда не видит остальную медиатеку. Человек или питомец вырезается прямо на устройстве с помощью Apple Vision. Фото и ваши снежные шары хранятся только внутри приложения на iPhone. Ничего не загружается. Для сохранения видео или картинки запрашивается только доступ на добавление в Фото."],
    ["Виджет и напоминания", "Виджет читает маленькое изображение шара из хранилища приложения на устройстве. Необязательное ежедневное напоминание — это локальное уведомление."],
    ["Покупки", "Необязательный Christmas Pass — разовая встроенная покупка через Apple; платёжные данные мы никогда не видим. Для проверки и восстановления покупок мы используем RevenueCat (https://www.revenuecat.com/privacy). Приложение передаёт RevenueCat случайный анонимный идентификатор, созданный приложением, ваши покупки в приложении, версию приложения, а также страну и язык устройства. Эти данные не связаны с вашим именем или Apple ID и не используются для рекламы или отслеживания."],
    ["Третьи стороны", "Кроме RevenueCat для покупок, в приложении нет стороннего кода рекламы, аналитики или соцсетей, и оно не устанавливает других интернет‑соединений."],
    ["Ваши права", "Мы не храним имя, e‑mail или контакты. Анонимную запись о покупке удалим по запросу: напишите на {EMAIL}. Удаление приложения стирает все фото и шары; покупка остаётся в вашем Apple ID и может быть восстановлена."],
    ["Контакты", "Вопросы о конфиденциальности: {EMAIL}"]]],
  s: ["Поддержка", "Globie", [
    ["Как поместить семью в шар?", "В редакторе нажмите кнопку «Фото» и выберите снимок. Люди и питомцы вырезаются автоматически; лучше всего подходит однотонный фон. Если никого не найдено, фото помещается в овальную рамку."],
    ["Как вызвать снег?", "Встряхните или наклоните iPhone либо коснитесь шара."],
    ["Как отправить?", "Откройте шар и нажмите «Отправить». Можно поделиться 12-секундной видеооткрыткой, квадратной картинкой или сохранить Live Photo."],
    ["Как добавить виджет?", "Удерживайте палец на экране «Домой», нажмите «Изменить», затем «Добавить виджет» и найдите Globie. С Christmas Pass виджет показывает ваш собственный шар."],
    ["Восстановить покупку", "Откройте экран покупки или Настройки и нажмите «Восстановить покупку». Christmas Pass работает на всех устройствах с тем же Аккаунтом Apple и в Семейном доступе."],
    ["Контакты", "Напишите на {EMAIL}, мы ответим."]]],
  t: ["Условия использования", "Действуют с 23 ноября 2026 г.", [
    ["Лицензия", "Globie предоставляется вам по Стандартному лицензионному соглашению с конечным пользователем Apple (EULA): {EULA} — эти условия лишь добавляют несколько пунктов о Globie."],
    ["Christmas Pass", "Создавать снежные шары бесплатно. Необязательный Christmas Pass — разовая встроенная покупка, а не подписка. Он открывает экспорт видео и Live Photo, убирает водяной знак и показывает ваш шар в виджете. Его можно восстановить на своих устройствах с тем же Аккаунтом Apple."],
    ["Оплата и возврат", "Все платежи обрабатывает Apple. Возвраты Apple выполняет по своим правилам; запросить возврат можно здесь: {REFUND}"],
    ["Ваш контент", "Ваши фото и шары остаются на устройстве и принадлежат вам. Мы никогда их не получаем, не храним и не используем. Используйте только фото, на которые у вас есть права."],
    ["Гарантии", "Приложение предоставляется «как есть» в пределах, допустимых законом, как описано в EULA Apple. Мы можем обновлять приложение и эти условия; дата выше указывает действующую версию."],
    ["Контакты", "{EMAIL}"]]],
});

L("uk", "Українська", {
  nav: ["Конфіденційність", "Підтримка", "Умови", "Мова"],
  p: ["Політика конфіденційності", "Діє з 25 листопада 2026 р.", [
    ["Коротко", "У Globie немає реклами, акаунтів і відстеження. Ваші фото ніколи не залишають iPhone. З пристрою передаються лише дані, потрібні для покупки Christmas Pass (див. Покупки)."],
    ["Фото", "Ви обираєте фото через системне вікно вибору, тож Globie ніколи не бачить решту медіатеки. Людину чи тварину вирізає саме пристрій за допомогою Apple Vision. Фото та ваші снігові кулі зберігаються лише в застосунку на iPhone. Нічого не вивантажується. Для збереження відео чи зображення запитується лише доступ на додавання у Фото."],
    ["Віджет і нагадування", "Віджет читає маленьке зображення кулі зі сховища застосунку на пристрої. Необовʼязкове щоденне нагадування — це локальне сповіщення."],
    ["Покупки", "Необов’язковий Christmas Pass — разова вбудована покупка через Apple; платіжних даних ми ніколи не бачимо. Для перевірки та відновлення покупок ми використовуємо RevenueCat (https://www.revenuecat.com/privacy). Застосунок передає RevenueCat випадковий анонімний ідентифікатор, створений застосунком, ваші покупки в застосунку, версію застосунку, а також країну й мову пристрою. Ці дані не пов’язані з вашим іменем чи Apple ID і не використовуються для реклами чи відстеження."],
    ["Треті сторони", "Окрім RevenueCat для покупок, у застосунку немає стороннього коду реклами, аналітики чи соцмереж, і він не встановлює інших інтернет‑з’єднань."],
    ["Ваші права", "Ми не зберігаємо ім’я, e‑mail чи контакти. Анонімний запис про покупку видалимо на запит: напишіть на {EMAIL}. Видалення застосунку стирає всі фото й кулі; покупка залишається у вашому Apple ID і може бути відновлена."],
    ["Контакти", "Питання про конфіденційність: {EMAIL}"]]],
  s: ["Підтримка", "Globie", [
    ["Як помістити родину в кулю?", "У редакторі торкніться кнопки «Фото» й оберіть знімок. Людей і тварин вирізано автоматично; найкраще підходить однотонне тло. Якщо нікого не знайдено, фото потрапить в овальну рамку."],
    ["Як викликати сніг?", "Струсніть або нахиліть iPhone чи торкніться кулі."],
    ["Як надіслати?", "Відкрийте кулю й торкніться «Надіслати». Можна поділитися 12-секундною відеолистівкою, квадратним зображенням або зберегти Live Photo."],
    ["Як додати віджет?", "Утримуйте палець на початковому екрані, торкніться «Змінити», потім «Додати віджет» і знайдіть Globie. З Christmas Pass віджет показує вашу власну кулю."],
    ["Відновити покупку", "Відкрийте екран покупки або Параметри й торкніться «Відновити покупку». Christmas Pass працює на всіх пристроях з тим самим обліковим записом Apple і в Сімейному доступі."],
    ["Контакти", "Напишіть на {EMAIL}, ми відповімо."]]],
  t: ["Умови використання", "Діють з 23 листопада 2026 р.", [
    ["Ліцензія", "Globie надається вам за Стандартною ліцензійною угодою з кінцевим користувачем Apple (EULA): {EULA} — ці умови лише додають кілька пунктів про Globie."],
    ["Christmas Pass", "Створювати снігові кулі безкоштовно. Необовʼязковий Christmas Pass — одноразова вбудована покупка, а не підписка. Він відкриває експорт відео й Live Photo, прибирає водяний знак і показує вашу кулю у віджеті. Його можна відновити на своїх пристроях з тим самим обліковим записом Apple."],
    ["Оплата й повернення", "Усі платежі обробляє Apple. Повернення коштів Apple здійснює за своїми правилами; запросити можна тут: {REFUND}"],
    ["Ваш вміст", "Ваші фото й кулі залишаються на пристрої та належать вам. Ми ніколи їх не отримуємо, не зберігаємо й не використовуємо. Використовуйте лише фото, на які маєте право."],
    ["Гарантії", "Застосунок надається «як є» в межах, дозволених законом, як описано в EULA Apple. Ми можемо оновлювати застосунок і ці умови; дата вище вказує чинну версію."],
    ["Контакти", "{EMAIL}"]]],
});

L("ar", "العربية", {
  nav: ["الخصوصية", "الدعم", "الشروط", "اللغة"],
  p: ["سياسة الخصوصية", "سارية اعتبارًا من 25 نوفمبر 2026", [
    ["باختصار", "لا يحتوي Globie على إعلانات أو حسابات أو تتبع. صورك لا تغادر جهاز iPhone أبدًا. البيانات الوحيدة التي تغادر الجهاز هي ما يلزم لشراء Christmas Pass (انظر المشتريات)."],
    ["الصور", "تختار الصورة من منتقي الصور في النظام، لذلك لا يرى Globie بقية مكتبتك أبدًا. يُقصّ الشخص أو الحيوان الأليف على جهازك باستخدام إطار Vision من Apple. تُحفظ الصورة وكراتك الثلجية داخل التطبيق على جهازك فقط. لا يُرفع أي شيء. عند حفظ فيديو أو صورة يُطلب إذن الإضافة إلى الصور فقط."],
    ["الأداة والتذكيرات", "تقرأ الأداة صورة صغيرة لكرتك من مساحة التطبيق على جهازك. التذكير اليومي الاختياري إشعار محلي."],
    ["المشتريات", "‏Christmas Pass الاختياري عملية شراء واحدة داخل التطبيق تديرها Apple؛ ولا نرى بيانات الدفع أبدًا. لفحص المشتريات واستعادتها نستخدم RevenueCat ‏(https://www.revenuecat.com/privacy). يرسل التطبيق إلى RevenueCat معرّفًا مجهولًا عشوائيًا ينشئه التطبيق، ومشترياتك في التطبيق، وإصدار التطبيق، وبلد الجهاز ولغته. لا ترتبط هذه البيانات باسمك أو بمعرّف Apple ولا تُستخدم للإعلانات أو التتبع."],
    ["الأطراف الثالثة", "باستثناء RevenueCat للمشتريات، لا يحتوي التطبيق على أي شيفرة من جهات خارجية للإعلانات أو التحليلات أو وسائل التواصل، ولا يُجري أي اتصالات أخرى بالإنترنت."],
    ["حقوقك", "لا نحتفظ باسم أو بريد إلكتروني أو بيانات اتصال. يُحذف سجل الشراء المجهول عند الطلب: راسلنا على {EMAIL}. حذف التطبيق يحذف كل الصور والكرات؛ ويبقى الشراء مرتبطًا بمعرّف Apple ويمكن استعادته."],
    ["التواصل", "أسئلة الخصوصية: {EMAIL}"]]],
  s: ["الدعم", "Globie", [
    ["كيف أضع عائلتي في الكرة؟", "في المحرر اضغط زر الصورة واختر صورة. يُقصّ الأشخاص والحيوانات تلقائيًا، والخلفية البسيطة تعطي أفضل نتيجة. إذا لم يُعثر على أحد توضع الصورة في إطار بيضاوي."],
    ["كيف أجعلها تثلج؟", "هزّ جهاز iPhone أو أمِله، أو اضغط على الكرة."],
    ["كيف أرسلها؟", "افتح كرتك واضغط إرسال. يمكنك مشاركة بطاقة فيديو مدتها 12 ثانية أو صورة مربعة أو حفظ صورة Live Photo."],
    ["كيف أضيف الأداة؟", "المس الشاشة الرئيسية مطولًا، واضغط تعديل ثم إضافة أداة وابحث عن Globie. مع Christmas Pass تعرض الأداة كرتك الخاصة."],
    ["استعادة الشراء", "افتح شاشة الشراء أو الإعدادات واضغط استعادة الشراء. يعمل Christmas Pass على كل الأجهزة بنفس حساب Apple ومع المشاركة العائلية."],
    ["التواصل", "راسلنا على {EMAIL} وسنرد عليك."]]],
  t: ["شروط الاستخدام", "سارية اعتبارًا من 23 نوفمبر 2026", [
    ["الترخيص", "يُرخَّص لك Globie بموجب اتفاقية ترخيص المستخدم النهائي القياسية من Apple ‏(EULA): {EULA} — تضيف هذه الشروط بضع نقاط خاصة بـ Globie فقط."],
    ["Christmas Pass", "إنشاء الكرات الثلجية مجاني. Christmas Pass الاختياري عملية شراء واحدة داخل التطبيق وليس اشتراكًا. يتيح تصدير الفيديو وLive Photo، ويزيل العلامة المائية، ويعرض كرتك في الأداة. يمكنك استعادته على أجهزتك بنفس حساب Apple."],
    ["الدفع والاسترداد", "تعالج Apple جميع المدفوعات. تتولى Apple عمليات الاسترداد وفق سياساتها، ويمكنك طلب الاسترداد من هنا: {REFUND}"],
    ["محتواك", "تبقى صورك وكراتك على جهازك وهي ملك لك. لا نستلمها ولا نخزنها ولا نستخدمها أبدًا. استخدم فقط الصور التي يحق لك استخدامها ومشاركتها."],
    ["الضمان", "يُقدَّم التطبيق «كما هو» في الحدود التي يسمح بها القانون، كما هو موضح في اتفاقية Apple. قد نحدّث التطبيق وهذه الشروط، ويوضح التاريخ أعلاه الإصدار الساري."],
    ["التواصل", "{EMAIL}"]]],
});

L("he", "עברית", {
  nav: ["פרטיות", "תמיכה", "תנאים", "שפה"],
  p: ["מדיניות פרטיות", "בתוקף מ־25 בנובמבר 2026", [
    ["בקצרה", "ב־Globie אין פרסומות, חשבונות או מעקב. התמונות שלך אף פעם לא יוצאות מה־iPhone. המידע היחיד שיוצא מהמכשיר הוא מה שנדרש לרכישת Christmas Pass (ראו רכישות)."],
    ["תמונות", "בוחרים תמונה בבורר התמונות של המערכת, כך ש־Globie לעולם לא רואה את שאר הספרייה. האדם או חיית המחמד נחתכים במכשיר עצמו בעזרת Vision של Apple. התמונה וכדורי השלג שלך נשמרים רק בתוך האפליקציה ב־iPhone. שום דבר לא מועלה. לשמירת סרטון או תמונה מתבקשת רק הרשאת הוספה לתמונות."],
    ["וידג׳ט ותזכורות", "הווידג׳ט קורא תמונה קטנה של הכדור מהאחסון של האפליקציה במכשיר. התזכורת היומית האופציונלית היא התראה מקומית."],
    ["רכישות", "‏Christmas Pass האופציונלי הוא רכישה חד־פעמית בתוך האפליקציה דרך Apple; איננו רואים את פרטי התשלום. לבדיקה ושחזור של רכישות אנחנו משתמשים ב־RevenueCat ‏(https://www.revenuecat.com/privacy). האפליקציה שולחת ל־RevenueCat מזהה אנונימי אקראי שהיא יוצרת, את הרכישות שלך באפליקציה, את גרסת האפליקציה ואת המדינה והשפה של המכשיר. המידע אינו מקושר לשמך או ל־Apple ID ואינו משמש לפרסום או למעקב."],
    ["צדדים שלישיים", "מלבד RevenueCat לרכישות, אין באפליקציה קוד של צד שלישי לפרסום, לניתוח או לרשתות חברתיות, והיא אינה מתחברת לאינטרנט בדרכים אחרות."],
    ["הזכויות שלך", "איננו שומרים שם, דוא״ל או פרטי קשר. רשומת הרכישה האנונימית תימחק לבקשתך: כתבו ל־{EMAIL}. מחיקת האפליקציה מוחקת את כל התמונות והכדורים; הרכישה נשארת ב־Apple ID וניתן לשחזר אותה."],
    ["יצירת קשר", "שאלות על פרטיות: {EMAIL}"]]],
  s: ["תמיכה", "Globie", [
    ["איך מכניסים את המשפחה לכדור?", "בעורך הקישו על כפתור התמונה ובחרו תמונה. אנשים וחיות מחמד נחתכים אוטומטית; רקע פשוט עובד הכי טוב. אם לא נמצא אף אחד, התמונה מוצבת במסגרת אליפטית."],
    ["איך גורמים לשלג לרדת?", "נערו או הטו את ה־iPhone, או הקישו על הכדור."],
    ["איך שולחים?", "פתחו את הכדור והקישו על שליחה. אפשר לשתף כרטיס וידאו של 12 שניות, תמונה ריבועית או לשמור Live Photo."],
    ["איך מוסיפים את הווידג׳ט?", "געו לחיצה ארוכה במסך הבית, הקישו על עריכה ואז על הוספת וידג׳ט וחפשו Globie. עם Christmas Pass הווידג׳ט מציג את הכדור שלכם."],
    ["שחזור רכישה", "פתחו את מסך הרכישה או את ההגדרות והקישו על שחזור רכישה. Christmas Pass עובד בכל המכשירים עם אותו חשבון Apple ובשיתוף משפחתי."],
    ["יצירת קשר", "כתבו אל {EMAIL} ונחזור אליכם."]]],
  t: ["תנאי שימוש", "בתוקף מ־23 בנובמבר 2026", [
    ["רישיון", "Globie ניתן לך ברישיון לפי הסכם רישיון משתמש הקצה הסטנדרטי של Apple ‏(EULA): {EULA} — תנאים אלה רק מוסיפים כמה נקודות על Globie."],
    ["Christmas Pass", "יצירת כדורי שלג היא בחינם. Christmas Pass האופציונלי הוא רכישה חד־פעמית בתוך האפליקציה, לא מינוי. הוא פותח ייצוא וידאו ו־Live Photo, מסיר את סימן המים ומציג את הכדור שלך בווידג׳ט. אפשר לשחזר אותו במכשירים שלך עם אותו חשבון Apple."],
    ["תשלומים והחזרים", "כל התשלומים מעובדים על ידי Apple. החזרים מטופלים על ידי Apple לפי המדיניות שלה; אפשר לבקש החזר כאן: {REFUND}"],
    ["התוכן שלך", "התמונות והכדורים שלך נשארים במכשיר ושייכים לך. איננו מקבלים, שומרים או משתמשים בהם לעולם. השתמשו רק בתמונות שיש לכם זכות להשתמש בהן ולשתף אותן."],
    ["אחריות", "האפליקציה ניתנת „כמות שהיא”, במידה שהחוק מתיר, כמתואר ב־EULA של Apple. אנו עשויים לעדכן את האפליקציה ואת התנאים; התאריך למעלה מציין את הגרסה התקפה."],
    ["יצירת קשר", "{EMAIL}"]]],
});

L("ja", "日本語", {
  nav: ["プライバシー", "サポート", "利用規約", "言語"],
  p: ["プライバシーポリシー", "2026年11月25日施行", [
    ["概要", "Globie には広告もアカウントもトラッキングもありません。写真が iPhone の外に出ることはありません。端末から送られるのは Christmas Pass の購入に必要な情報だけです（「購入」を参照）。"],
    ["写真", "写真はシステムの写真ピッカーで選ぶため、Globieがライブラリのほかの写真を見ることはありません。人物やペットの切り抜きは、AppleのVisionフレームワークを使ってデバイス上で行われます。写真とスノードームはiPhone上のアプリ内にのみ保存され、アップロードされることはありません。ビデオや画像の保存時は、写真への追加のみのアクセスを求めます。"],
    ["ウィジェットとリマインダー", "ウィジェットはデバイス上のアプリの保存領域からスノードームの小さな画像を読み込みます。任意の毎日のリマインダーはローカル通知です。"],
    ["購入", "任意の Christmas Pass は Apple が処理する1回限りのアプリ内課金で、支払い情報を私たちが見ることはありません。購入の確認と復元には RevenueCat（https://www.revenuecat.com/privacy ）を使用します。アプリは RevenueCat に、アプリが作成したランダムな匿名 ID、アプリ内での購入、アプリのバージョン、端末の国と言語を送信します。これらは氏名や Apple ID とは結び付けられず、広告やトラッキングには使われません。"],
    ["第三者", "購入のための RevenueCat 以外に、広告・分析・SNS などのサードパーティのコードはなく、ほかのインターネット接続も行いません。"],
    ["あなたの権利", "氏名・メール・連絡先は保持していません。匿名の購入記録はご依頼により削除します：{EMAIL} までご連絡ください。アプリを削除するとすべての写真とスノードームが消えます。購入は Apple ID に残り、復元できます。"],
    ["お問い合わせ", "プライバシーに関するご質問：{EMAIL}"]]],
  s: ["サポート", "Globie", [
    ["家族をスノードームに入れるには？", "エディタで「写真」ボタンをタップして写真を選びます。人物とペットは自動で切り抜かれます。背景がシンプルな写真がおすすめです。誰も見つからない場合は、楕円のフレームに写真が入ります。"],
    ["雪を降らせるには？", "iPhoneを振るか傾けるか、スノードームをタップします。"],
    ["送るには？", "スノードームを開いて「送る」をタップします。12秒のビデオカードや正方形の画像を共有したり、Live Photoを保存したりできます。"],
    ["ウィジェットを追加するには？", "ホーム画面を長押しして「編集」→「ウィジェットを追加」をタップし、Globieを検索します。Christmas Passがあれば、ウィジェットに自分のスノードームが表示されます。"],
    ["購入を復元", "購入画面または設定を開き「購入を復元」をタップします。Christmas Passは同じApple Accountのすべてのデバイスとファミリー共有で使えます。"],
    ["お問い合わせ", "{EMAIL} までご連絡ください。"]]],
  t: ["利用規約", "2026年11月23日施行", [
    ["ライセンス", "GlobieはAppleの標準使用許諾契約（EULA）に基づいて提供されます：{EULA} 本規約はGlobie固有のいくつかの点を補足するものです。"],
    ["Christmas Pass", "スノードームの作成は無料です。任意のChristmas Passは1回限りのApp内課金で、サブスクリプションではありません。ビデオとLive Photoの書き出し、透かしの削除、ウィジェットへの自分のスノードーム表示が可能になります。同じApple Accountのデバイスで復元できます。"],
    ["支払いと返金", "支払いはすべてAppleが処理します。返金はAppleのポリシーに従ってAppleが対応します。こちらからリクエストできます：{REFUND}"],
    ["あなたのコンテンツ", "写真とスノードームはデバイス上に保存され、あなたのものです。私たちがそれらを受け取ったり、保存・使用したりすることはありません。使用・共有する権利のある写真のみを使ってください。"],
    ["保証", "本アプリは、AppleのEULAに記載のとおり、法律で認められる範囲で「現状のまま」提供されます。アプリと本規約は更新されることがあり、上記の日付が最新版を示します。"],
    ["お問い合わせ", "{EMAIL}"]]],
});

L("ko", "한국어", {
  nav: ["개인정보", "지원", "이용약관", "언어"],
  p: ["개인정보 처리방침", "2026년 11월 25일부터 시행", [
    ["요약", "Globie에는 광고, 계정, 추적이 없어요. 사진은 절대 iPhone 밖으로 나가지 않아요. 기기 밖으로 나가는 정보는 Christmas Pass 구매 처리에 필요한 것뿐이에요(구매 항목 참고)."],
    ["사진", "사진은 시스템 사진 선택기로 고르므로 Globie는 보관함의 나머지 사진을 볼 수 없습니다. 사람이나 반려동물은 Apple의 Vision 프레임워크로 기기에서 잘라냅니다. 사진과 스노볼은 iPhone의 앱 안에만 저장되며 업로드되지 않습니다. 비디오나 이미지를 저장할 때는 사진에 추가하는 권한만 요청합니다."],
    ["위젯과 알림", "위젯은 기기의 앱 저장 공간에서 스노볼의 작은 이미지를 읽습니다. 선택 사항인 매일 알림은 로컬 알림입니다."],
    ["구입", "선택 사항인 Christmas Pass는 Apple이 처리하는 1회성 인앱 구매이며, 결제 정보는 저희가 볼 수 없어요. 구매 확인과 복원을 위해 RevenueCat(https://www.revenuecat.com/privacy )을 사용해요. 앱은 RevenueCat에 앱이 만든 무작위 익명 ID, 앱 내 구매 내역, 앱 버전, 기기의 국가와 언어를 보내요. 이 정보는 이름이나 Apple ID와 연결되지 않으며 광고나 추적에 쓰이지 않아요."],
    ["제3자", "구매용 RevenueCat 외에는 광고, 분석, 소셜 미디어 등 제3자 코드가 없고, 다른 인터넷 연결도 하지 않아요."],
    ["사용자 권리", "이름, 이메일, 연락처는 보관하지 않아요. 익명 구매 기록은 요청 시 삭제해 드려요: {EMAIL}로 연락하세요. 앱을 삭제하면 모든 사진과 스노우볼이 지워지며, 구매는 Apple ID에 남아 복원할 수 있어요."],
    ["문의", "개인정보 관련 문의: {EMAIL}"]]],
  s: ["지원", "Globie", [
    ["가족을 스노볼에 넣으려면?", "편집기에서 사진 버튼을 탭하고 사진을 고르세요. 사람과 반려동물은 자동으로 잘라냅니다. 배경이 단순한 사진이 가장 좋습니다. 아무도 찾지 못하면 사진이 타원형 액자에 들어갑니다."],
    ["눈을 내리게 하려면?", "iPhone을 흔들거나 기울이거나 스노볼을 탭하세요."],
    ["보내려면?", "스노볼을 열고 보내기를 탭하세요. 12초 비디오 카드나 정사각형 이미지를 공유하거나 Live Photo로 저장할 수 있습니다."],
    ["위젯을 추가하려면?", "홈 화면을 길게 누르고 편집, 위젯 추가를 탭한 다음 Globie를 검색하세요. Christmas Pass가 있으면 위젯에 내 스노볼이 표시됩니다."],
    ["구입 복원", "구입 화면이나 설정을 열고 구입 복원을 탭하세요. Christmas Pass는 같은 Apple 계정의 모든 기기와 가족 공유에서 사용할 수 있습니다."],
    ["문의", "{EMAIL}로 연락 주시면 답변드리겠습니다."]]],
  t: ["이용약관", "2026년 11월 23일부터 시행", [
    ["라이선스", "Globie는 Apple 표준 최종 사용자 사용권 계약(EULA)에 따라 제공됩니다: {EULA} 본 약관은 Globie에 관한 몇 가지 사항만 추가합니다."],
    ["Christmas Pass", "스노볼 만들기는 무료입니다. 선택 사항인 Christmas Pass는 구독이 아닌 1회성 앱 내 구입입니다. 비디오와 Live Photo 내보내기를 열고, 워터마크를 없애며, 위젯에 내 스노볼을 보여줍니다. 같은 Apple 계정의 기기에서 복원할 수 있습니다."],
    ["결제 및 환불", "모든 결제는 Apple이 처리합니다. 환불은 Apple 정책에 따라 Apple이 처리하며, 여기에서 요청할 수 있습니다: {REFUND}"],
    ["사용자 콘텐츠", "사진과 스노볼은 기기에 남아 있으며 사용자의 것입니다. 저희는 이를 받거나 저장하거나 사용하지 않습니다. 사용하고 공유할 권리가 있는 사진만 사용하세요."],
    ["보증", "앱은 Apple EULA에 따라 법이 허용하는 범위에서 ‘있는 그대로’ 제공됩니다. 앱과 본 약관은 업데이트될 수 있으며, 위 날짜가 최신 버전을 나타냅니다."],
    ["문의", "{EMAIL}"]]],
});

L("zh-Hans", "简体中文", {
  nav: ["隐私", "支持", "条款", "语言"],
  p: ["隐私政策", "自2026年11月25日起生效", [
    ["概述", "Globie 没有广告、没有账号，也不追踪。你的照片永远不会离开 iPhone。只有处理 Christmas Pass 购买所需的数据会离开设备（见“购买”）。"],
    ["照片", "你通过系统照片选择器选取照片，因此 Globie 永远看不到图库中的其他内容。人物或宠物通过 Apple 的 Vision 框架在设备上抠出。照片和你的水晶球只保存在 iPhone 上的应用内，不会上传任何内容。保存视频或图片时只请求“仅添加”照片权限。"],
    ["小组件和提醒", "小组件从设备上的应用存储中读取水晶球的小图片。可选的每日提醒是本地通知。"],
    ["购买", "可选的 Christmas Pass 是由 Apple 处理的一次性 App 内购买，我们看不到你的付款信息。为核对和恢复购买，我们使用 RevenueCat（https://www.revenuecat.com/privacy ）。App 会向 RevenueCat 发送由 App 生成的随机匿名 ID、你在 App 内的购买、App 版本以及设备的国家和语言。这些数据不与你的姓名或 Apple ID 关联，也不用于广告或追踪。"],
    ["第三方", "除用于购买的 RevenueCat 外，App 中没有任何第三方广告、分析或社交媒体代码，也不会建立其他网络连接。"],
    ["你的权利", "我们不保存姓名、邮箱或联系方式。匿名购买记录可应要求删除：请发邮件至 {EMAIL}。删除 App 会清除所有照片和水晶球；购买记录保留在你的 Apple ID 中，可随时恢复。"],
    ["联系我们", "隐私问题：{EMAIL}"]]],
  s: ["支持", "Globie", [
    ["怎样把家人放进水晶球？", "在编辑器中轻点“照片”按钮并选择一张照片。人物和宠物会被自动抠出，背景简单的照片效果最好。如果没有识别到人，照片会放进椭圆相框。"],
    ["怎样让它下雪？", "摇晃或倾斜 iPhone，或轻点水晶球。"],
    ["怎样发送？", "打开水晶球并轻点“发送”。你可以分享 12 秒视频贺卡、方形图片，或保存为实况照片。"],
    ["怎样添加小组件？", "长按主屏幕，轻点“编辑”，再轻点“添加小组件”并搜索 Globie。拥有 Christmas Pass 后，小组件会显示你自己的水晶球。"],
    ["恢复购买", "打开购买页面或设置，轻点“恢复购买”。Christmas Pass 可在使用同一 Apple 账户的所有设备和家人共享中使用。"],
    ["联系我们", "请写信至 {EMAIL}，我们会回复你。"]]],
  t: ["使用条款", "自2026年11月25日起生效", [
    ["许可", "Globie 依据 Apple 标准最终用户许可协议（EULA）授权给你：{EULA} 本条款仅补充几项与 Globie 相关的内容。"],
    ["Christmas Pass", "制作水晶球是免费的。可选的 Christmas Pass 是一次性 App 内购买，不是订阅。它可解锁视频和实况照片导出、去除水印，并在小组件中显示你自己的水晶球。你可以在使用同一 Apple 账户的设备上恢复购买。"],
    ["付款与退款", "所有付款均由 Apple 处理。退款由 Apple 按其政策处理，你可以在此申请：{REFUND}"],
    ["你的内容", "你的照片和水晶球保存在你的设备上，归你所有。我们从不接收、存储或使用它们。请只使用你有权使用和分享的照片。"],
    ["保证", "在法律允许的范围内，本应用按 Apple EULA 所述“按原样”提供。我们可能会更新应用和本条款，上方日期为当前版本。"],
    ["联系我们", "{EMAIL}"]]],
});

L("zh-Hant", "繁體中文", {
  nav: ["隱私權", "支援", "條款", "語言"],
  p: ["隱私權政策", "自2026年11月23日起生效", [
    ["摘要", "Globie 沒有廣告、沒有帳號，也不追蹤。你的照片永遠不會離開 iPhone。只有處理 Christmas Pass 購買所需的資料會離開裝置（見「購買」）。"],
    ["照片", "你透過系統照片選擇器挑選照片，因此 Globie 永遠看不到圖庫中的其他內容。人物或寵物透過 Apple 的 Vision 框架在裝置上去背。照片和你的雪花球只儲存在 iPhone 上的 App 內，不會上傳任何內容。儲存影片或圖片時只要求「僅加入」照片權限。"],
    ["小工具與提醒", "小工具從裝置上的 App 儲存空間讀取雪花球的小圖片。可選的每日提醒是本機通知。"],
    ["購買", "選用的 Christmas Pass 是由 Apple 處理的一次性 App 內購買，我們看不到你的付款資訊。為核對與恢復購買，我們使用 RevenueCat（https://www.revenuecat.com/privacy ）。App 會傳送給 RevenueCat 由 App 產生的隨機匿名 ID、你在 App 內的購買、App 版本以及裝置的國家與語言。這些資料不與你的姓名或 Apple ID 連結，也不用於廣告或追蹤。"],
    ["第三方", "除用於購買的 RevenueCat 外，App 中沒有任何第三方廣告、分析或社群媒體程式碼，也不會建立其他網路連線。"],
    ["你的權利", "我們不保存姓名、電子郵件或聯絡方式。匿名購買紀錄可應要求刪除：請寫信至 {EMAIL}。刪除 App 會清除所有照片與水晶球；購買紀錄保留在你的 Apple ID 中，可隨時恢復。"],
    ["聯絡我們", "隱私權問題：{EMAIL}"]]],
  s: ["支援", "Globie", [
    ["怎麼把家人放進雪花球？", "在編輯器中點一下「照片」按鈕並選擇照片。人物和寵物會自動去背，背景單純的照片效果最好。如果沒有辨識到人，照片會放進橢圓相框。"],
    ["怎麼讓它下雪？", "搖晃或傾斜 iPhone，或點一下雪花球。"],
    ["怎麼傳送？", "打開雪花球並點一下「傳送」。你可以分享 12 秒影片卡片、方形圖片，或儲存為原況照片。"],
    ["怎麼加入小工具？", "長按主畫面，點一下「編輯」，再點「加入小工具」並搜尋 Globie。擁有 Christmas Pass 後，小工具會顯示你自己的雪花球。"],
    ["回復購買", "打開購買畫面或設定，點一下「回復購買」。Christmas Pass 可在使用同一 Apple 帳號的所有裝置與家人共享中使用。"],
    ["聯絡我們", "請寫信至 {EMAIL}，我們會回覆你。"]]],
  t: ["使用條款", "自2026年11月23日起生效", [
    ["授權", "Globie 依據 Apple 標準終端使用者授權合約（EULA）授權給你：{EULA} 本條款僅補充幾項與 Globie 相關的內容。"],
    ["Christmas Pass", "製作雪花球是免費的。可選的 Christmas Pass 是一次性 App 內購買，不是訂閱。它可解鎖影片和原況照片輸出、移除浮水印，並在小工具中顯示你自己的雪花球。你可以在使用同一 Apple 帳號的裝置上回復購買。"],
    ["付款與退款", "所有付款皆由 Apple 處理。退款由 Apple 依其政策處理，你可以在此申請：{REFUND}"],
    ["你的內容", "你的照片和雪花球保存在你的裝置上，歸你所有。我們從不接收、儲存或使用它們。請只使用你有權使用和分享的照片。"],
    ["保證", "在法律允許的範圍內，本 App 依 Apple EULA 所述「依現狀」提供。我們可能會更新 App 與本條款，上方日期為目前版本。"],
    ["聯絡我們", "{EMAIL}"]]],
});

L("th", "ไทย", {
  nav: ["ความเป็นส่วนตัว", "ช่วยเหลือ", "ข้อกำหนด", "ภาษา"],
  p: ["นโยบายความเป็นส่วนตัว", "มีผลตั้งแต่ 25 พฤศจิกายน 2026", [
    ["สรุป", "Globie ไม่มีโฆษณา ไม่มีบัญชี และไม่ติดตามผู้ใช้ รูปของคุณไม่เคยออกจาก iPhone ข้อมูลที่ออกจากอุปกรณ์มีเพียงสิ่งที่จำเป็นสำหรับการซื้อ Christmas Pass (ดูหัวข้อการซื้อ)"],
    ["รูปภาพ", "คุณเลือกรูปผ่านตัวเลือกรูปภาพของระบบ Globie จึงไม่เห็นรูปอื่นในคลังของคุณ บุคคลหรือสัตว์เลี้ยงจะถูกตัดบนอุปกรณ์ด้วยเฟรมเวิร์ก Vision ของ Apple รูปภาพและลูกแก้วหิมะของคุณถูกเก็บไว้ในแอปบน iPhone เท่านั้น ไม่มีการอัปโหลดใดๆ การบันทึกวิดีโอหรือรูปภาพจะขอสิทธิ์เพิ่มลงในรูปภาพเท่านั้น"],
    ["วิดเจ็ตและการเตือน", "วิดเจ็ตอ่านรูปเล็กๆ ของลูกแก้วจากพื้นที่จัดเก็บของแอปบนอุปกรณ์ การเตือนรายวันที่เลือกได้เป็นการแจ้งเตือนภายในเครื่อง"],
    ["การซื้อ", "Christmas Pass เป็นการซื้อในแอปครั้งเดียวที่ Apple ดำเนินการ เราไม่เคยเห็นข้อมูลการชำระเงินของคุณ เพื่อตรวจสอบและกู้คืนการซื้อ เราใช้ RevenueCat (https://www.revenuecat.com/privacy ) แอปจะส่งรหัสนิรนามแบบสุ่มที่แอปสร้าง ประวัติการซื้อในแอป เวอร์ชันแอป และประเทศกับภาษาของอุปกรณ์ไปยัง RevenueCat ข้อมูลนี้ไม่เชื่อมโยงกับชื่อหรือ Apple ID ของคุณ และไม่ใช้เพื่อโฆษณาหรือการติดตาม"],
    ["บุคคลที่สาม", "นอกจาก RevenueCat สำหรับการซื้อแล้ว แอปไม่มีโค้ดจากบุคคลที่สามสำหรับโฆษณา การวิเคราะห์ หรือโซเชียลมีเดีย และไม่เชื่อมต่ออินเทอร์เน็ตอื่น"],
    ["สิทธิ์ของคุณ", "เราไม่เก็บชื่อ อีเมล หรือข้อมูลติดต่อ บันทึกการซื้อแบบนิรนามลบได้เมื่อร้องขอ: เขียนถึง {EMAIL} การลบแอปจะลบรูปและลูกแก้วทั้งหมด ส่วนการซื้อยังอยู่กับ Apple ID และกู้คืนได้"],
    ["ติดต่อ", "คำถามเรื่องความเป็นส่วนตัว: {EMAIL}"]]],
  s: ["ช่วยเหลือ", "Globie", [
    ["จะใส่ครอบครัวในลูกแก้วได้อย่างไร", "ในตัวแก้ไข แตะปุ่มรูปภาพแล้วเลือกรูป บุคคลและสัตว์เลี้ยงจะถูกตัดโดยอัตโนมัติ รูปที่พื้นหลังเรียบได้ผลดีที่สุด หากไม่พบใคร รูปจะถูกวางในกรอบวงรี"],
    ["จะทำให้หิมะตกได้อย่างไร", "เขย่าหรือเอียง iPhone หรือแตะที่ลูกแก้ว"],
    ["จะส่งได้อย่างไร", "เปิดลูกแก้วแล้วแตะส่ง คุณสามารถแชร์การ์ดวิดีโอ 12 วินาที รูปสี่เหลี่ยมจัตุรัส หรือบันทึกเป็น Live Photo"],
    ["จะเพิ่มวิดเจ็ตได้อย่างไร", "แตะหน้าจอโฮมค้างไว้ แตะแก้ไข แล้วเพิ่มวิดเจ็ต และค้นหา Globie เมื่อมี Christmas Pass วิดเจ็ตจะแสดงลูกแก้วของคุณเอง"],
    ["กู้คืนการซื้อ", "เปิดหน้าการซื้อหรือการตั้งค่าแล้วแตะกู้คืนการซื้อ Christmas Pass ใช้ได้ทุกอุปกรณ์ที่ใช้บัญชี Apple เดียวกันและกับการแชร์กันในครอบครัว"],
    ["ติดต่อ", "เขียนถึงเราที่ {EMAIL} แล้วเราจะตอบกลับ"]]],
  t: ["ข้อกำหนดการใช้งาน", "มีผลตั้งแต่ 23 พฤศจิกายน 2026", [
    ["สัญญาอนุญาต", "Globie อนุญาตให้คุณใช้ภายใต้ข้อตกลงสิทธิ์การใช้งานสำหรับผู้ใช้ปลายทางมาตรฐานของ Apple (EULA): {EULA} ข้อกำหนดนี้เพียงเพิ่มบางประเด็นเกี่ยวกับ Globie"],
    ["Christmas Pass", "การสร้างลูกแก้วหิมะไม่มีค่าใช้จ่าย Christmas Pass ที่เลือกได้เป็นการซื้อภายในแอปครั้งเดียว ไม่ใช่การสมัครสมาชิก ปลดล็อกการส่งออกวิดีโอและ Live Photo ลบลายน้ำ และแสดงลูกแก้วของคุณบนวิดเจ็ต คุณกู้คืนได้บนอุปกรณ์ที่ใช้บัญชี Apple เดียวกัน"],
    ["การชำระเงินและการคืนเงิน", "Apple เป็นผู้ดำเนินการชำระเงินทั้งหมด การคืนเงินดำเนินการโดย Apple ตามนโยบายของ Apple คุณขอคืนเงินได้ที่: {REFUND}"],
    ["เนื้อหาของคุณ", "รูปภาพและลูกแก้วของคุณอยู่บนอุปกรณ์และเป็นของคุณ เราไม่เคยรับ จัดเก็บ หรือใช้งาน โปรดใช้เฉพาะรูปที่คุณมีสิทธิ์ใช้และแชร์"],
    ["การรับประกัน", "แอปให้บริการ “ตามสภาพ” เท่าที่กฎหมายอนุญาต ตามที่ระบุใน EULA ของ Apple เราอาจอัปเดตแอปและข้อกำหนดนี้ วันที่ด้านบนแสดงฉบับปัจจุบัน"],
    ["ติดต่อ", "{EMAIL}"]]],
});

L("vi", "Tiếng Việt", {
  nav: ["Quyền riêng tư", "Hỗ trợ", "Điều khoản", "Ngôn ngữ"],
  p: ["Chính sách quyền riêng tư", "Có hiệu lực từ 25 tháng 11 năm 2026", [
    ["Tóm tắt", "Globie không có quảng cáo, tài khoản hay theo dõi. Ảnh của bạn không bao giờ rời khỏi iPhone. Dữ liệu duy nhất rời khỏi thiết bị là thông tin cần cho việc mua Christmas Pass (xem Mua hàng)."],
    ["Ảnh", "Bạn chọn ảnh bằng trình chọn ảnh của hệ thống nên Globie không bao giờ thấy phần còn lại của thư viện. Người hoặc thú cưng được tách nền ngay trên thiết bị bằng Vision của Apple. Ảnh và quả cầu tuyết của bạn chỉ được lưu trong ứng dụng trên iPhone. Không có gì được tải lên. Khi lưu video hoặc ảnh, ứng dụng chỉ xin quyền thêm vào Ảnh."],
    ["Tiện ích và lời nhắc", "Tiện ích đọc một ảnh nhỏ của quả cầu từ bộ nhớ của ứng dụng trên thiết bị. Lời nhắc hằng ngày tùy chọn là thông báo cục bộ."],
    ["Mua hàng", "Christmas Pass tùy chọn là giao dịch mua một lần trong ứng dụng do Apple xử lý; chúng tôi không bao giờ thấy thông tin thanh toán của bạn. Để kiểm tra và khôi phục giao dịch, chúng tôi dùng RevenueCat (https://www.revenuecat.com/privacy). Ứng dụng gửi tới RevenueCat một ID ẩn danh ngẫu nhiên do ứng dụng tạo, các giao dịch trong ứng dụng, phiên bản ứng dụng cùng quốc gia và ngôn ngữ của thiết bị. Dữ liệu này không gắn với tên hay Apple ID của bạn và không dùng cho quảng cáo hay theo dõi."],
    ["Bên thứ ba", "Ngoài RevenueCat cho việc mua hàng, ứng dụng không có mã bên thứ ba cho quảng cáo, phân tích hay mạng xã hội, và không tạo kết nối internet nào khác."],
    ["Quyền của bạn", "Chúng tôi không lưu tên, email hay thông tin liên hệ. Bản ghi giao dịch ẩn danh sẽ được xóa khi bạn yêu cầu: viết tới {EMAIL}. Xóa ứng dụng sẽ xóa mọi ảnh và quả cầu; giao dịch vẫn gắn với Apple ID và có thể khôi phục."],
    ["Liên hệ", "Câu hỏi về quyền riêng tư: {EMAIL}"]]],
  s: ["Hỗ trợ", "Globie", [
    ["Làm sao đưa gia đình vào quả cầu?", "Trong trình chỉnh sửa, chạm nút Ảnh và chọn một ảnh. Người và thú cưng được tách nền tự động; nền đơn giản cho kết quả tốt nhất. Nếu không tìm thấy ai, ảnh sẽ được đặt trong khung hình bầu dục."],
    ["Làm sao cho tuyết rơi?", "Lắc hoặc nghiêng iPhone, hoặc chạm vào quả cầu."],
    ["Làm sao gửi?", "Mở quả cầu và chạm Gửi. Bạn có thể chia sẻ thiệp video 12 giây, ảnh vuông hoặc lưu Live Photo."],
    ["Làm sao thêm tiện ích?", "Chạm và giữ Màn hình chính, chạm Sửa, rồi Thêm tiện ích và tìm Globie. Với Christmas Pass, tiện ích hiển thị quả cầu của riêng bạn."],
    ["Khôi phục giao dịch", "Mở màn hình mua hoặc Cài đặt và chạm Khôi phục giao dịch. Christmas Pass dùng được trên mọi thiết bị có cùng Tài khoản Apple và với Chia sẻ trong gia đình."],
    ["Liên hệ", "Hãy viết cho chúng tôi tại {EMAIL}."]]],
  t: ["Điều khoản sử dụng", "Có hiệu lực từ 23 tháng 11 năm 2026", [
    ["Giấy phép", "Globie được cấp phép cho bạn theo Thỏa thuận cấp phép người dùng cuối tiêu chuẩn của Apple (EULA): {EULA} — các điều khoản này chỉ bổ sung vài điểm về Globie."],
    ["Christmas Pass", "Tạo quả cầu tuyết là miễn phí. Christmas Pass tùy chọn là giao dịch mua một lần trong ứng dụng, không phải gói đăng ký. Nó mở khóa xuất video và Live Photo, bỏ hình mờ và hiển thị quả cầu của bạn trên tiện ích. Bạn có thể khôi phục trên các thiết bị dùng cùng Tài khoản Apple."],
    ["Thanh toán và hoàn tiền", "Mọi khoản thanh toán do Apple xử lý. Việc hoàn tiền do Apple thực hiện theo chính sách của Apple; bạn có thể yêu cầu tại: {REFUND}"],
    ["Nội dung của bạn", "Ảnh và quả cầu của bạn nằm trên thiết bị và thuộc về bạn. Chúng tôi không bao giờ nhận, lưu hay sử dụng chúng. Chỉ dùng những ảnh bạn có quyền sử dụng và chia sẻ."],
    ["Bảo đảm", "Ứng dụng được cung cấp “nguyên trạng” trong phạm vi pháp luật cho phép, như mô tả trong EULA của Apple. Chúng tôi có thể cập nhật ứng dụng và các điều khoản này; ngày ở trên cho biết phiên bản hiện hành."],
    ["Liên hệ", "{EMAIL}"]]],
});

L("id", "Bahasa Indonesia", {
  nav: ["Privasi", "Dukungan", "Ketentuan", "Bahasa"],
  p: ["Kebijakan Privasi", "Berlaku mulai 25 November 2026", [
    ["Ringkasan", "Globie tidak punya iklan, akun, atau pelacakan. Fotomu tidak pernah keluar dari iPhone. Satu-satunya data yang keluar dari perangkat adalah yang diperlukan untuk pembelian Christmas Pass (lihat Pembelian)."],
    ["Foto", "Anda memilih foto dengan pemilih foto sistem, jadi Globie tidak pernah melihat isi perpustakaan lainnya. Orang atau hewan peliharaan dipotong di perangkat dengan framework Vision dari Apple. Foto dan bola salju Anda hanya disimpan di dalam app di iPhone. Tidak ada yang diunggah. Saat menyimpan video atau gambar, hanya izin menambahkan ke Foto yang diminta."],
    ["Widget dan pengingat", "Widget membaca gambar kecil bola Anda dari penyimpanan app di perangkat. Pengingat harian opsional adalah notifikasi lokal."],
    ["Pembelian", "Christmas Pass opsional adalah pembelian dalam aplikasi sekali bayar yang ditangani Apple; kami tidak pernah melihat data pembayaranmu. Untuk memeriksa dan memulihkan pembelian kami memakai RevenueCat (https://www.revenuecat.com/privacy). Aplikasi mengirim ke RevenueCat ID anonim acak buatan aplikasi, pembelianmu di aplikasi, versi aplikasi, serta negara dan bahasa perangkat. Data ini tidak terhubung dengan nama atau Apple ID-mu dan tidak dipakai untuk iklan atau pelacakan."],
    ["Pihak ketiga", "Selain RevenueCat untuk pembelian, tidak ada kode pihak ketiga untuk iklan, analitik, atau media sosial, dan aplikasi tidak membuat koneksi internet lain."],
    ["Hak Anda", "Kami tidak menyimpan nama, email, atau kontak. Catatan pembelian anonim dihapus atas permintaan: tulis ke {EMAIL}. Menghapus aplikasi menghapus semua foto dan bola; pembelian tetap di Apple ID-mu dan bisa dipulihkan."],
    ["Kontak", "Pertanyaan privasi: {EMAIL}"]]],
  s: ["Dukungan", "Globie", [
    ["Bagaimana memasukkan keluarga ke bola?", "Di editor, ketuk tombol Foto dan pilih foto. Orang dan hewan peliharaan dipotong otomatis; latar polos memberi hasil terbaik. Jika tidak ada yang ditemukan, foto ditempatkan dalam bingkai oval."],
    ["Bagaimana membuat salju turun?", "Goyangkan atau miringkan iPhone, atau ketuk bola."],
    ["Bagaimana mengirimnya?", "Buka bola Anda dan ketuk Kirim. Anda dapat membagikan kartu video 12 detik, gambar persegi, atau menyimpan Live Photo."],
    ["Bagaimana menambahkan widget?", "Sentuh lama Layar Utama, ketuk Edit, lalu Tambah Widget dan cari Globie. Dengan Christmas Pass, widget menampilkan bola Anda sendiri."],
    ["Pulihkan pembelian", "Buka layar pembelian atau Pengaturan dan ketuk Pulihkan pembelian. Christmas Pass berlaku di semua perangkat dengan Akun Apple yang sama dan dengan Keluarga Berbagi."],
    ["Kontak", "Tulis ke {EMAIL}, kami akan membalas."]]],
  t: ["Ketentuan Penggunaan", "Berlaku mulai 23 November 2026", [
    ["Lisensi", "Globie dilisensikan kepada Anda berdasarkan Perjanjian Lisensi Pengguna Akhir standar Apple (EULA): {EULA} — ketentuan ini hanya menambahkan beberapa poin tentang Globie."],
    ["Christmas Pass", "Membuat bola salju gratis. Christmas Pass opsional adalah pembelian dalam app satu kali, bukan langganan. Ini membuka ekspor video dan Live Photo, menghapus tanda air, dan menampilkan bola Anda di widget. Anda dapat memulihkannya di perangkat dengan Akun Apple yang sama."],
    ["Pembayaran dan pengembalian dana", "Semua pembayaran diproses oleh Apple. Pengembalian dana ditangani Apple sesuai kebijakannya; Anda dapat memintanya di: {REFUND}"],
    ["Konten Anda", "Foto dan bola Anda tetap di perangkat dan milik Anda. Kami tidak pernah menerima, menyimpan, atau menggunakannya. Gunakan hanya foto yang berhak Anda gunakan dan bagikan."],
    ["Jaminan", "App disediakan “sebagaimana adanya” sejauh diizinkan hukum, sesuai EULA Apple. Kami dapat memperbarui app dan ketentuan ini; tanggal di atas menunjukkan versi yang berlaku."],
    ["Kontak", "{EMAIL}"]]],
});

L("ms", "Bahasa Melayu", {
  nav: ["Privasi", "Sokongan", "Terma", "Bahasa"],
  p: ["Dasar Privasi", "Berkuat kuasa mulai 25 November 2026", [
    ["Ringkasan", "Globie tiada iklan, akaun atau penjejakan. Foto anda tidak pernah keluar dari iPhone. Satu-satunya data yang keluar dari peranti ialah yang diperlukan untuk pembelian Christmas Pass (lihat Pembelian)."],
    ["Foto", "Anda memilih foto melalui pemilih foto sistem, jadi Globie tidak pernah melihat kandungan pustaka yang lain. Orang atau haiwan peliharaan dipotong pada peranti menggunakan rangka kerja Vision Apple. Foto dan glob salji anda disimpan hanya dalam app pada iPhone. Tiada apa-apa dimuat naik. Semasa menyimpan video atau gambar, hanya kebenaran menambah ke Foto diminta."],
    ["Widget dan peringatan", "Widget membaca gambar kecil glob anda daripada storan app pada peranti. Peringatan harian pilihan ialah pemberitahuan setempat."],
    ["Pembelian", "Christmas Pass pilihan ialah pembelian dalam aplikasi sekali bayar yang dikendalikan Apple; kami tidak pernah melihat butiran pembayaran anda. Untuk menyemak dan memulihkan pembelian kami menggunakan RevenueCat (https://www.revenuecat.com/privacy). Aplikasi menghantar kepada RevenueCat ID tanpa nama rawak yang dicipta aplikasi, pembelian anda dalam aplikasi, versi aplikasi serta negara dan bahasa peranti. Data ini tidak dikaitkan dengan nama atau Apple ID anda dan tidak digunakan untuk iklan atau penjejakan."],
    ["Pihak ketiga", "Selain RevenueCat untuk pembelian, tiada kod pihak ketiga untuk iklan, analitik atau media sosial, dan aplikasi tidak membuat sambungan internet lain."],
    ["Hak anda", "Kami tidak menyimpan nama, e-mel atau butiran hubungan. Rekod pembelian tanpa nama dipadam atas permintaan: tulis ke {EMAIL}. Memadam aplikasi memadam semua foto dan glob; pembelian kekal pada Apple ID anda dan boleh dipulihkan."],
    ["Hubungi", "Soalan privasi: {EMAIL}"]]],
  s: ["Sokongan", "Globie", [
    ["Bagaimana memasukkan keluarga ke dalam glob?", "Dalam editor, ketik butang Foto dan pilih foto. Orang dan haiwan peliharaan dipotong secara automatik; latar belakang ringkas paling sesuai. Jika tiada sesiapa ditemui, foto diletakkan dalam bingkai bujur."],
    ["Bagaimana membuat salji turun?", "Goncang atau condongkan iPhone, atau ketik glob."],
    ["Bagaimana menghantarnya?", "Buka glob anda dan ketik Hantar. Anda boleh berkongsi kad video 12 saat, gambar segi empat sama atau menyimpan Live Photo."],
    ["Bagaimana menambah widget?", "Sentuh dan tahan Skrin Utama, ketik Edit, kemudian Tambah Widget dan cari Globie. Dengan Christmas Pass, widget memaparkan glob anda sendiri."],
    ["Pulihkan pembelian", "Buka skrin pembelian atau Seting dan ketik Pulihkan pembelian. Christmas Pass berfungsi pada semua peranti dengan Akaun Apple yang sama dan dengan Perkongsian Keluarga."],
    ["Hubungi", "Tulis kepada {EMAIL} dan kami akan membalas."]]],
  t: ["Terma Penggunaan", "Berkuat kuasa mulai 23 November 2026", [
    ["Lesen", "Globie dilesenkan kepada anda di bawah Perjanjian Lesen Pengguna Akhir standard Apple (EULA): {EULA} — terma ini hanya menambah beberapa perkara tentang Globie."],
    ["Christmas Pass", "Mencipta glob salji adalah percuma. Christmas Pass pilihan ialah pembelian dalam app sekali sahaja, bukan langganan. Ia membuka eksport video dan Live Photo, membuang tera air dan memaparkan glob anda pada widget. Anda boleh memulihkannya pada peranti dengan Akaun Apple yang sama."],
    ["Pembayaran dan bayaran balik", "Semua pembayaran diproses oleh Apple. Bayaran balik dikendalikan oleh Apple mengikut dasarnya; anda boleh memohon di: {REFUND}"],
    ["Kandungan anda", "Foto dan glob anda kekal pada peranti dan milik anda. Kami tidak pernah menerima, menyimpan atau menggunakannya. Gunakan hanya foto yang anda berhak gunakan dan kongsi."],
    ["Waranti", "App disediakan “seadanya” setakat dibenarkan undang-undang, seperti yang diterangkan dalam EULA Apple. Kami boleh mengemas kini app dan terma ini; tarikh di atas menunjukkan versi semasa."],
    ["Hubungi", "{EMAIL}"]]],
});

L("hi", "हिन्दी", {
  nav: ["गोपनीयता", "सहायता", "शर्तें", "भाषा"],
  p: ["गोपनीयता नीति", "25 नवंबर 2026 से प्रभावी", [
    ["सारांश", "Globie में कोई विज्ञापन, अकाउंट या ट्रैकिंग नहीं है। आपकी फ़ोटो कभी iPhone से बाहर नहीं जातीं। डिवाइस से सिर्फ़ वही डेटा जाता है जो Christmas Pass की ख़रीदारी के लिए ज़रूरी है (ख़रीदारी देखें)।"],
    ["तस्वीरें", "आप सिस्टम के फ़ोटो पिकर से तस्वीर चुनते हैं, इसलिए Globie आपकी लाइब्रेरी का बाकी हिस्सा कभी नहीं देखता। व्यक्ति या पालतू जानवर को Apple के Vision फ़्रेमवर्क से आपके डिवाइस पर ही काटा जाता है। तस्वीर और आपके स्नो ग्लोब केवल iPhone पर ऐप के अंदर रखे जाते हैं। कुछ भी अपलोड नहीं होता। वीडियो या तस्वीर सेव करते समय केवल Photos में जोड़ने की अनुमति माँगी जाती है।"],
    ["विजेट और रिमाइंडर", "विजेट आपके डिवाइस पर ऐप के स्टोरेज से ग्लोब की एक छोटी तस्वीर पढ़ता है। वैकल्पिक दैनिक रिमाइंडर एक स्थानीय सूचना है।"],
    ["खरीदारी", "वैकल्पिक Christmas Pass, Apple द्वारा संभाली जाने वाली एक बार की इन-ऐप ख़रीदारी है; हम आपकी भुगतान जानकारी कभी नहीं देखते। ख़रीदारी जाँचने और वापस लाने के लिए हम RevenueCat (https://www.revenuecat.com/privacy) का उपयोग करते हैं। ऐप RevenueCat को ऐप द्वारा बनाई गई एक रैंडम गुमनाम ID, ऐप में आपकी ख़रीदारी, ऐप वर्ज़न और डिवाइस का देश व भाषा भेजता है। यह आपके नाम या Apple ID से नहीं जुड़ता और विज्ञापन या ट्रैकिंग के लिए इस्तेमाल नहीं होता।"],
    ["तृतीय पक्ष", "ख़रीदारी के लिए RevenueCat के अलावा ऐप में विज्ञापन, एनालिटिक्स या सोशल मीडिया का कोई थर्ड-पार्टी कोड नहीं है, और ऐप कोई अन्य इंटरनेट कनेक्शन नहीं बनाता।"],
    ["आपके अधिकार", "हम नाम, ईमेल या संपर्क जानकारी नहीं रखते। गुमनाम ख़रीदारी रिकॉर्ड अनुरोध पर हटाया जाता है: {EMAIL} पर लिखें। ऐप हटाने से सभी फ़ोटो और ग्लोब हट जाते हैं; ख़रीदारी आपकी Apple ID में रहती है और वापस लाई जा सकती है।"],
    ["संपर्क", "गोपनीयता से जुड़े सवाल: {EMAIL}"]]],
  s: ["सहायता", "Globie", [
    ["परिवार को ग्लोब में कैसे डालें?", "एडिटर में फ़ोटो बटन पर टैप करें और तस्वीर चुनें। लोग और पालतू जानवर अपने-आप कट जाते हैं; सादे बैकग्राउंड वाली तस्वीर सबसे अच्छी रहती है। अगर कोई नहीं मिलता, तो तस्वीर अंडाकार फ़्रेम में लगती है।"],
    ["बर्फ़ कैसे गिराएँ?", "iPhone को हिलाएँ या झुकाएँ, या ग्लोब पर टैप करें।"],
    ["इसे कैसे भेजें?", "अपना ग्लोब खोलें और भेजें पर टैप करें। आप 12 सेकंड का वीडियो कार्ड, चौकोर तस्वीर शेयर कर सकते हैं या Live Photo सेव कर सकते हैं।"],
    ["विजेट कैसे जोड़ें?", "होम स्क्रीन को दबाकर रखें, संपादित करें पर टैप करें, फिर विजेट जोड़ें और Globie खोजें। Christmas Pass के साथ विजेट आपका अपना ग्लोब दिखाता है।"],
    ["खरीदारी बहाल करें", "खरीदारी स्क्रीन या सेटिंग्स खोलें और खरीदारी बहाल करें पर टैप करें। Christmas Pass उसी Apple खाते वाले सभी डिवाइस और फ़ैमिली शेयरिंग में काम करता है।"],
    ["संपर्क", "{EMAIL} पर लिखें, हम जवाब देंगे।"]]],
  t: ["उपयोग की शर्तें", "23 नवंबर 2026 से प्रभावी", [
    ["लाइसेंस", "Globie आपको Apple के मानक अंतिम उपयोगकर्ता लाइसेंस समझौते (EULA) के तहत लाइसेंस दिया जाता है: {EULA} — ये शर्तें केवल Globie से जुड़ी कुछ बातें जोड़ती हैं।"],
    ["Christmas Pass", "स्नो ग्लोब बनाना मुफ़्त है। वैकल्पिक Christmas Pass एक बार की इन-ऐप खरीदारी है, सब्सक्रिप्शन नहीं। यह वीडियो और Live Photo एक्सपोर्ट खोलता है, वॉटरमार्क हटाता है और विजेट पर आपका ग्लोब दिखाता है। आप इसे उसी Apple खाते वाले डिवाइस पर बहाल कर सकते हैं।"],
    ["भुगतान और रिफ़ंड", "सभी भुगतान Apple द्वारा संसाधित होते हैं। रिफ़ंड Apple अपनी नीतियों के अनुसार देता है; आप यहाँ अनुरोध कर सकते हैं: {REFUND}"],
    ["आपकी सामग्री", "आपकी तस्वीरें और ग्लोब आपके डिवाइस पर रहते हैं और आपके ही हैं। हम उन्हें कभी प्राप्त, संग्रहीत या उपयोग नहीं करते। केवल वे तस्वीरें उपयोग करें जिनके उपयोग और साझा करने का आपको अधिकार है।"],
    ["वारंटी", "ऐप कानून द्वारा अनुमत सीमा तक “जैसा है” प्रदान किया जाता है, जैसा Apple EULA में बताया गया है। हम ऐप और इन शर्तों को अपडेट कर सकते हैं; ऊपर की तारीख वर्तमान संस्करण बताती है।"],
    ["संपर्क", "{EMAIL}"]]],
});

L("ca", "Català", {
  nav: ["Privadesa", "Suport", "Condicions", "Idioma"],
  p: ["Política de privadesa", "Vigent des del 25 de novembre de 2026", [
    ["Resum", "Globie no té anuncis, comptes ni seguiment. Les teves fotos no surten mai de l’iPhone. Les úniques dades que surten del dispositiu són les necessàries per a la compra del Christmas Pass (vegeu Compres)."],
    ["Fotos", "Tries una foto amb el selector del sistema, així que Globie no veu mai la resta de la teva fototeca. La persona o la mascota es retalla al dispositiu amb el framework Vision d'Apple. La foto i les teves boles de neu només es desen dins l'app a l'iPhone. No es puja res. Per desar un vídeo o una imatge només es demana accés per afegir a Fotos."],
    ["Giny i recordatoris", "El giny llegeix una imatge petita de la teva bola de l'emmagatzematge de l'app al dispositiu. El recordatori diari opcional és una notificació local."],
    ["Compres", "El Christmas Pass opcional és una compra única dins l’app gestionada per Apple; mai no veiem les teves dades de pagament. Per comprovar i restaurar compres fem servir RevenueCat (https://www.revenuecat.com/privacy). L’app envia a RevenueCat un ID anònim aleatori creat per l’app, les teves compres a l’app, la versió de l’app i el país i l’idioma del dispositiu. No es vincula al teu nom ni al teu ID d’Apple i no s’utilitza per a publicitat ni seguiment."],
    ["Tercers", "A part de RevenueCat per a les compres, l’app no té codi de tercers de publicitat, analítica ni xarxes socials, i no fa cap altra connexió a internet."],
    ["Els teus drets", "No guardem nom, correu ni dades de contacte. El registre anònim de compra s’esborra si ho demanes: escriu a {EMAIL}. Esborrar l’app elimina totes les fotos i boles; la compra queda al teu ID d’Apple i es pot restaurar."],
    ["Contacte", "Preguntes sobre privadesa: {EMAIL}"]]],
  s: ["Suport", "Globie", [
    ["Com poso la meva família a la bola?", "A l'editor, toca el botó Foto i tria una foto. Les persones i les mascotes es retallen automàticament; un fons llis funciona millor. Si no es troba ningú, la foto es col·loca en un marc oval."],
    ["Com faig que nevi?", "Sacseja o inclina l'iPhone, o toca la bola."],
    ["Com l'envio?", "Obre la teva bola i toca Envia. Pots compartir una postal en vídeo de 12 segons, una imatge quadrada o desar una Live Photo."],
    ["Com afegeixo el giny?", "Mantén premuda la pantalla d'inici, toca Edita, després Afegeix un giny i cerca Globie. Amb el Christmas Pass, el giny mostra la teva pròpia bola."],
    ["Restaurar la compra", "Obre la pantalla de compra o la Configuració i toca Restaura la compra. El Christmas Pass funciona a tots els dispositius amb el mateix compte d'Apple i amb En família."],
    ["Contacte", "Escriu a {EMAIL} i et respondrem."]]],
  t: ["Condicions d'ús", "Vigents des del 23 de novembre de 2026", [
    ["Llicència", "Globie se t'atorga sota el Contracte de llicència d'usuari final estàndard d'Apple (EULA): {EULA} — aquestes condicions només hi afegeixen alguns punts sobre Globie."],
    ["Christmas Pass", "Crear boles de neu és gratuït. El Christmas Pass opcional és una compra única dins l'app, no una subscripció. Desbloqueja l'exportació de vídeo i Live Photo, treu la marca d'aigua i mostra la teva bola al giny. El pots restaurar als teus dispositius amb el mateix compte d'Apple."],
    ["Pagaments i reemborsaments", "Apple processa tots els pagaments. Els reemborsaments els gestiona Apple segons les seves polítiques; en pots demanar un aquí: {REFUND}"],
    ["El teu contingut", "Les teves fotos i boles es queden al teu dispositiu i són teves. No les rebem, desem ni fem servir mai. Fes servir només fotos que tinguis dret a usar i compartir."],
    ["Garantia", "L'app es proporciona «tal com és», en la mesura que permeti la llei, tal com descriu l'EULA d'Apple. Podem actualitzar l'app i aquestes condicions; la data de dalt indica la versió vigent."],
    ["Contacte", "{EMAIL}"]]],
});
