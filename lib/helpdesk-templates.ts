export type HelpdeskTheme = 'red' | 'dark' | 'graphite'
export type HelpdeskFormat = '1:1' | '9:16' | '16:9'
export type HelpdeskTopElement = 'icon' | 'title' | 'none'
export type HelpdeskLayout = 'standard' | 'social-mockup' | 'no-card'

export interface HelpdeskCategory {
  id: string
  theme: HelpdeskTheme
  label: string
  defaultTopElement: HelpdeskTopElement
  layout: HelpdeskLayout
  defaultIcon: string          // path under /malzemeler/ or empty
  defaultTitle: string
  defaultBody: string
  defaultDate: string
}

// Background image resolver — returns URL-safe paths
export function getHelpdeskBackground(theme: HelpdeskTheme, categoryId: string, format: HelpdeskFormat): string {
  if (theme === 'graphite') {
    if (categoryId === 'it-krizleri') {
      const suffix = format === '9:16' ? '9X16' : format === '1:1' ? '1X1' : '16X9'
      return `/malzemeler/IT-KRIZI-${suffix}.png`
    }
    // Bölgede Savaş — Turkish chars in filename, must be URL-encoded
    const suffix = format === '9:16' ? '9X16' : format === '1:1' ? '1X1' : '16X9'
    return `/malzemeler/Sava%C5%9F-%C4%B0leti%C5%9Fimi-01-${suffix}.png`
  }
  if (theme === 'dark') {
    const suffix = format === '9:16' ? '9-16' : format === '1:1' ? '1-1' : '16-9'
    return `/malzemeler/dark_${suffix}.png`
  }
  // Red theme
  if (format === '1:1')  return '/malzemeler/RED_1X1.png'
  if (format === '9:16') return '/malzemeler/RED_9X16.png'
  return '/malzemeler/RED_16X9.png'
}

// CSS background fallback (used if image fails to load)
export function getHelpdeskBgFallback(theme: HelpdeskTheme): string {
  if (theme === 'red')      return 'linear-gradient(160deg, #cc0000 0%, #8b0000 100%)'
  if (theme === 'dark')     return '#111111'
  return '#1a1a1a'
}

// Auto logo selection per theme:
//   Dark  → logo_dark.png  (white logo, readable on dark bg)
//   Red / Graphite → Logo.png (colored logo, readable on red/graphite bg)
export function getHelpdeskLogo(theme: HelpdeskTheme): string {
  if (theme === 'dark') return '/malzemeler/logo_dark.png'
  return '/malzemeler/Logo.png'
}

// Per-format letter-spacing (CSS em), matching TK brand spec:
//   Portrait (9:16) / Square (1:1): tracking +25 → 0.025em
//   Landscape (16:9):               tracking -5  → -0.005em
export function getHelpdeskLetterSpacing(format: HelpdeskFormat): string {
  return format === '16:9' ? '-0.005em' : '0.025em'
}

export const HELPDESK_CATEGORIES: HelpdeskCategory[] = [
  // ─── RED (8) ────────────────────────────────────────────────────────────────
  {
    id: 'ucus-iptali',
    theme: 'red',
    label: 'Uçuş İptali & Sefer Değişiklikleri',
    defaultTopElement: 'icon',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'UÇUŞ İPTALİ & SEFER DEĞİŞİKLİKLERİ',
    defaultBody: `Değerli Yolcularımız,
İstanbul'da yarın (30/03/2026) beklenen hava muhalefeti,
İstanbul ve Sabiha Gökçen Havalimanları kalkışlı ve varışlı seferlerimizi etkilemektedir.
Uçuşlarınız hakkında güncel bilgi için: 🔎 URL
Anlayışınız için teşekkür ederiz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'bilet-degisikligi',
    theme: 'red',
    label: 'Bilet Değişikliği',
    defaultTopElement: 'icon',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'BİLET DEĞİŞİKLİĞİ',
    defaultBody: `Sayın Yolcumuz,

Biletinizde değişiklik yapılmıştır. Güncel bilet bilgileriniz aşağıda yer almaktadır:

• PNR: [PNR KODU]
• Yolcu Adı: [AD SOYAD]
• Eski Sefer: [ESKİ SEFER NO]
• Yeni Sefer: [YENİ SEFER NO]
• Tarih: [TARİH]

Herhangi bir sorunuz için lütfen iletişime geçin.
İletişim: 444 0 849`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'ikram-vakalari',
    theme: 'red',
    label: 'İkram Vakaları',
    defaultTopElement: 'icon',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'İKRAM VAKALARI',
    defaultBody: `01.01.2026 tarihinde İstanbul–İzmir seferini gerçekleştiren
TK-1111 sefer sayılı uçuşumuzda, yolcu sayısına ilişkin yaşanan aksaklık nedeniyle
ikram yüklemesi eksik yapılmıştır.

Yaşanan aksaklıktan dolayı özür diler, etkilenen yolcularımızın
durumlarının telafi edilmesi için kendileriyle iletişime
geçildiğini kamuoyunun bilgisine sunarız.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'fraud-phishing',
    theme: 'red',
    label: 'Fraud / Phishing',
    defaultTopElement: 'icon',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'FRAUD & PHİSHİNG UYARISI',
    defaultBody: `Türk Hava Yolları adına gönderilmiş gibi görünen ve ödül bilet içerdiği iddia edilen sahte mesajların yayıldığı tespit edilmiştir.

Bu tür mesajlarda yer alan bağlantıların açılmaması ve mesajların silinmesi önemle rica olunur.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'men-edilme',
    theme: 'red',
    label: 'Men Edilme',
    defaultTopElement: 'icon',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'UÇUŞTAN MEN EDİLME',
    defaultBody: `01.01.2026 tarihinde gerçekleştirilen
TK-1111 İstanbul – İzmir seferimizde uçuş
emniyetini tehlikeye atan ve kabin ekiplerimizin
uyarılarına rağmen kurallara aykırı
davranışlarda bulunduğu tespit edilen
yolcu hakkında yasal işlem başlatılmıştır.

Söz konusu yolcu …… süreyle / süresiz olarak
uçuşlardan men listesine alınmıştır.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'ai-aciklama',
    theme: 'red',
    label: 'AI Açıklama',
    defaultTopElement: 'icon',
    layout: 'standard',
    defaultIcon: '/malzemeler/Asset 1.png',
    defaultTitle: '',
    defaultBody: `Değerli yolcularımız,

Son günlerde sosyal medyada Türk Hava Yolları'na ait olduğu iddia edilen ve yapay zekâ ile oluşturulmuş bazı sahte içeriklerin dolaşımı girdiği tespit edilmiştir.
Söz konusu videolar gerçeği yansıtmamakta olup markamızla herhangi bir bağlantısı bulunmamaktadır.

Yanıltıcı ve gerçeği yansıtmayan bu tür içeriklere itibar edilmemesini önemle rica eder, güncel ve doğru bilgiler için resmi iletişim kanallarımızın takip edilmesini hatırlatırız.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'ucus-duyuru',
    theme: 'red',
    label: 'Uçuş Duyuru İletişimi',
    defaultTopElement: 'icon',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'UÇUŞ DUYURUSU',
    defaultBody: `Değerli Yolcularımız,
Uçuşumuz sırasında, bazen hava koşullarına bağlı olarak kısa süreli türbülanslarla karşılaşabiliriz.
Bu durum, uçuş güvenliğimizi etkilemez ve pilotlarımız bu gibi durumlarla başa çıkmak ______ üzere kapsamlı eğitimler almıştır.
Lütfen bu süreçte kemerlerinizi bağlı tutunuz ve kabin ekibimizin talimatlarını takip ediniz.
Uçağımız, yolculuğunuzun en güvenli ve konforlu şekilde devam etmesi için tasarlanmıştır.
Herhangi bir sorunuz olursa, kabin ekibimiz size memnuniyetle yardımcı olacaktır.
Gösterdiğiniz anlayış için teşekkür eder, iyi bir uçuş geçirmenizi dileriz.

Saygılarımızla,`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'sahte-hesaplar',
    theme: 'red',
    label: 'Sahte Hesaplar',
    defaultTopElement: 'none',
    layout: 'social-mockup',
    defaultIcon: '',
    defaultTitle: 'SAHTE HESAP UYARISI',
    defaultBody: `Bu hesap SAHTE'dir.

@[SAHTE_HESAP_ADI] adlı sosyal medya hesabı Türk Hava Yolları ile ilgisi bulunmamaktadır.

Resmi Hesaplarımız:
Instagram: @turkishairlines
Twitter/X: @TurkishAirlines
Facebook: Turkish Airlines

Lütfen sahte hesaplara kişisel bilgi paylaşmayın.

Bildirin: social@thy.com`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },

  // ─── DARK ───────────────────────────────────────────────────────────────────
  {
    id: 'dark-deprem',
    theme: 'dark',
    label: 'Doğal Afet / Deprem',
    defaultTopElement: 'title',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'GEÇMİŞ OLSUN',
    defaultBody: `01.01.2026 tarihinde Marmara Bölgesi'nde meydana gelen
şiddetli deprem nedeniyle İstanbul varışlı ve kalkışlı
uçuşlarımızda aksamalar yaşanabilmektedir.

Bu kapsamda tüm yolcularımız, biletlerini satın aldıkları
kanal üzerinden uçuşları için değişiklik
ve iade talebinde bulunabilirler.

Anlayışınız için teşekkür ederiz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-havaalani-saldiri-1',
    theme: 'dark',
    label: 'Doğal Afet / Hava Alanı Saldırı',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `Değerli yolcularımız,

iGA İstanbul Havaalanı'nda yaşanan saldırı sebebiyle planlanlı
uçuşlarımızda tehir ve iptaller meydana gelmektedir.

Uçuşunuz ile ilgili tüm güncel bilgilere
www.turkishairlines.com üzerinden ulaşabilirsiniz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-havaalani-saldiri-2',
    theme: 'dark',
    label: 'Doğal Afet / Hava Alanı Saldırı 2',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `Değerli yolcularımız,

iGA İstanbul Havaalanı'nda yaşanan saldırı neticesinde
Marmara bölgesine olan seferlerimiz 01.01.2027 tarihine kadar durdurulmuştur.

Uçuşlarınızda mağduriyet yaşamamanız adına
iGA İstanbul Havalimanı varış/çıkışlı iptal olan seferlerimizi
www.turkishairlines.com üzerinden öğrenebilirsiniz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-havaalani-saldiri-3',
    theme: 'dark',
    label: 'Doğal Afet / Hava Alanı Saldırı 3',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `Değerli yolcularımız,

Olay sebebi ile ara verilen İstanbul
varışlı/çıkışlı uçuşlarımız normale dönmüştür.

Uçuşunuz ile ilgili tüm güncel bilgilere
www.turkishairlines.com ve 0850 333 0849
numaralı Çağrı Merkezimiz
üzerinden ulaşabilirsiniz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-kaza-haberi',
    theme: 'dark',
    label: 'Kaza Haberi',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `TK-1111 sefer sayılı İstanbul-İzmir güzergâh uçağıyla
irtibatımız saat 21.00'da kesilmiştir.

Uçağımızla irtibat kurma çalışmaları devam etmekte
olup kamuoyunu sürece dair bilgilendirmeye
devam edeceğiz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-kacirma-1',
    theme: 'dark',
    label: 'Kaza Haberi / Uçağın Kaçırılması 1',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `İstanbul-İzmir seferini yapmakta olan TK-1111 sefer
sayılı uçağımızın kaçırılarak Ankara Esenboğa
havalimanına indirildiği tespit edilmiştir.

Uçaktaki 92 yolcu ve mürettebatın sağlık durumları ile
ilgili olarak ilgili ülke makamları ile görüşmeler devam
etmekte olup kamuoyunu sürece dair bilgilendirmeye
devam edeceğiz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-kacirma-2',
    theme: 'dark',
    label: 'Kaza Haberi / Uçağın Kaçırılması 2',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `Değerli yolcularımız,

Olay sebebi ile ara verilen İstanbul
varışlı/çıkışlı uçuşlarımız normale dönmüştür.

Uçuşunuz ile ilgili tüm güncel bilgilere
www.turkishairlines.com ve 0850 333 0849 numaralı
Çağrı Merkezimiz üzerinden ulaşabilirsiniz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-pistten-cikma-1',
    theme: 'dark',
    label: 'Kaza Haberi / Uçağın Pistten Çıkması',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `TK-1111 sefer sayılı uçağımız iGA İstanbul Havalimanı'ndan
kalkış sırasında henüz belirlenemeyen
bir sebeple pistten çıkmıştır.

Ekiplerimiz olay yerine sevk edilmiş olup
müdahaleye ve tahliyelere başlanmıştır.

Olayla ilgili tüm gelişmelere
www.turkishairlines.com üzerinden ve sosyal medya
hesaplarımızdan ulaşabilirsiniz.

Kamuoyunu sürece dair bilgilendirmeye devam edeceğiz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-pistten-cikma-2',
    theme: 'dark',
    label: 'Kaza Haberi / Uçağın Pistten Çıkması 2',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `iGA İstanbul Havalimanı'ndan
kalkış sırasında pistten çıkan TK-1111 sefer sayılı
uçağımızda bulunan 92 yolcu ve mürettebatımızın
tamamının sağlık durumları iyi olup, tahliyeleri başarıyla tamamlanmıştır.

Konuyla ilgili tüm gelişmelere web sitemizden
ve sosyal medya hesaplarımızdan ulaşabilirsiniz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-sehit-haberi',
    theme: 'dark',
    label: 'Şehit Haberi',
    defaultTopElement: 'title',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'BAŞIMIZ SAĞ OLSUN',
    defaultBody: `Değerli yolcularımız,
Yalova'da düzenlenen terör operasyonu sırasında
3 kahraman askerimizin şehit olduğu haberini
derin bir üzüntüyle öğrenmiş bulunuyoruz.

Görevleri başında şehit düşen
kahraman ASKERLERİMİZE Allah'tan rahmet;
yakınlarına ve milletimize başsağlığı diliyoruz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-savas-1',
    theme: 'dark',
    label: 'Savaş İletişimi',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `Yaşanan bölgesel gerginlik sebebiyle İstanbul çıkışlı ve
varışlı uçuşlarımız olumsuz etkilenmektedir.

Uçuşunuz ile ilgili tüm güncel bilgilere
www.turkishairlines.com ve 0850 333 0849 numaralı
Çağrı Merkezimiz üzerinden ulaşabilirsiniz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-savas-2',
    theme: 'dark',
    label: 'Savaş İletişimi 2',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `İsrail ile İran arasında oluşan savaş durumu nedeniyle
İstanbul çıkışlı ve varışlı bazı uçuşlarımız olumsuz etkilenmektedir.

Uçuşunuz ile ilgili tüm güncel bilgilere
www.turkishairlines.com ve 0850 333 0849 numaralı
Çağrı Merkezimiz üzerinden ulaşabilirsiniz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-bomba-1',
    theme: 'dark',
    label: 'Asıllı Bomba İhbarı',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `TK-1111 sefer sayılı İstanbul-İzmir güzergâhında seyreden
uçak saat 21.00'da güvenlik nedeniyle
Ankara Esenboğa havaalanına iniş gerçekleştirmiştir.

Tüm güncel bilgilere www.turkishairlines.com ve
0850 333 0849 numaralı Çağrı Merkezimiz
üzerinden ulaşabilirsiniz.

Kamuoyunu sürece dair bilgilendirmeye
devam edeceğiz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-bomba-2',
    theme: 'dark',
    label: 'Asıllı Bomba İhbarı 2',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `TK-1111 sefer sayılı İstanbul-İzmir güzergâhında seyreden ve güvenlik
nedeniyle Ankara Esenboğa havalimanına acil iniş
gerçekleştiren uçağımız gerekli önlemlerin ardından
seferine devam edecektir.

Kamuoyunun bilgisine sunarız.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-bomba-3',
    theme: 'dark',
    label: 'Asıllı Bomba İhbarı 3',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `TK-1111 sefer sayılı
İstanbul-İzmir güzergâhında seyreden
ve güvenlik nedeniyle Ankara Esenboğa
havalimanına acil iniş gerçekleştiren
uçağımız gerekli önlemlerin ardından
seferine devam etmiştir.

Kamuoyunun bilgisine sunarız.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-salgin-1',
    theme: 'dark',
    label: 'Salgın Hastalık İletişimi',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `Değerli yolcularımız,
Covid-19 salgını sebebiyle Çin ülkesine seferlerimiz
geçici olarak durdurulmuştur.

İlgili uçuş noktasına seyahat edecek yolcularımızın mağduriyet
yaşamaması adına güncel uçuşlarını www.turkishairlines.com
ve 0850 333 0849 numaralı Çağrı Merkezimiz üzerinden
takip etmelerini önemle rica ederiz.

Kamuoyunu sürece dair bilgilendirmeye devam edeceğiz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-salgin-2',
    theme: 'dark',
    label: 'Salgın Hastalık İletişimi 2',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `Değerli yolcularımız,
Covid-19 salgını sebebiyle Çin ülkesine geçici olarak
durdurulan seferlerimiz ilgili otoritelerle koordinasyon
içinde yeniden başlamıştır.

Uçuşlarınızla ilgili güncel bilgilere
www.turkishairlines.com ve 0850 333 0849 numaralı
Çağrı Merkezimiz üzerinden ulaşabilirsiniz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-salgin-3',
    theme: 'dark',
    label: 'Salgın Hastalık İletişimi 3',
    defaultTopElement: 'none',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: '',
    defaultBody: `Değerli yolcularımız,
Covid-19 salgını sebebiyle geçici olarak durdurulan
Çin ülkesine seferlerimiz normale dönmüştür.

Uçuşlarınızla ilgili güncel bilgilere
www.turkishairlines.com ve 0850 333 0849 numaralı
Çağrı Merkezimiz üzerinden ulaşabilirsiniz.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'dark-anma',
    theme: 'dark',
    label: 'Anma Haberi İletişimi',
    defaultTopElement: 'title',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'GEÇMİŞ OLSUN',
    defaultBody: `...bölgesinde meydana gelen deprem felaketi nedeniyle derin üzüntü içindeyiz.

Hayatını kaybeden vatandaşlarımıza Allah'tan rahmet, yaralılara acil şifalar diliyoruz.

Ulus olarak yaşadığımız bu acı günlerde, tüm kalbimizle afet bölgesindeki vatandaşlarımızın yanındayız.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },

  // ─── GRAPHITE (3) ───────────────────────────────────────────────────────────
  {
    id: 'it-krizleri',
    theme: 'graphite',
    label: 'IT Krizleri',
    defaultTopElement: 'title',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'IT KRİZİ BİLGİLENDİRMESİ',
    defaultBody: `Teknik Ekibimize,

[SİSTEM ADI] sisteminde kritik bir arıza tespit edilmiştir.

Etki Alanı: [ETKİLENEN SİSTEMLER]
Başlangıç Saati: [SAAT]
Tahmini Çözüm: [TAHMİNİ SÜRE]

Alınan Aksiyonlar:
• IT Kriz Ekibi devreye alındı
• Yedek sistemler aktive edildi
• Üst yönetim bilgilendirildi

Sık güncellemeler için: #it-kriz kanalını takip edin`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'bolgede-savas',
    theme: 'graphite',
    label: 'Bölgede Savaş İletişimi',
    defaultTopElement: 'none',
    layout: 'no-card',
    defaultIcon: '',
    defaultTitle: 'BÖLGE GÜVENLİK DUYURUSU',
    defaultBody: `[BÖLGE ADI] bölgesindeki güvenlik durumuna ilişkin önemli duyuru:

[BÖLGE İSMİ] üzerindeki tüm uçuşlar [TARİH] itibarıyla geçici olarak askıya alınmıştır.

Etkilenen Seferler:
[SEFER LİSTESİ]

Yolcularımız bilet iadesi veya rota değişikliği için aşağıdaki kanallardan bizimle iletişime geçebilir:

thy.com | 444 0 849

Güvenliğiniz her şeyin önündedir.`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
  {
    id: 'graphite-genel',
    theme: 'graphite',
    label: 'Kurumsal Açıklama',
    defaultTopElement: 'title',
    layout: 'standard',
    defaultIcon: '',
    defaultTitle: 'KURUMSAL AÇIKLAMA',
    defaultBody: `Kamuoyuna,

Türk Hava Yolları olarak [KONU] hakkında kamuoyunu bilgilendirme ihtiyacı duymaktayız.

[AÇIKLAMA METNİ]

Şirketimiz, yolcu güvenliği ve memnuniyetini her zaman ön planda tutmaktadır. Bu doğrultuda gerekli tüm adımlar atılmış olup süreç yakından takip edilmektedir.

Kamuoyuna saygıyla duyurulur.

Türk Hava Yolları A.O.
İletişim Direktörlüğü`,
    defaultDate: new Date().toLocaleDateString('tr-TR'),
  },
]

export function getHelpdeskCategoriesByTheme(theme: HelpdeskTheme): HelpdeskCategory[] {
  return HELPDESK_CATEGORIES.filter(c => c.theme === theme)
}

export function getHelpdeskCategory(id: string): HelpdeskCategory | undefined {
  return HELPDESK_CATEGORIES.find(c => c.id === id)
}

export const FORMAT_DIMENSIONS: Record<HelpdeskFormat, { w: number; h: number }> = {
  '1:1':  { w: 1200, h: 1200 },
  '9:16': { w: 1080, h: 1920 },
  '16:9': { w: 1920, h: 1080 },
}

// Per-format layout constants (pixel positions at actual canvas resolution)
// Measured from reference images.
// iconTopPct   : icon top edge as fraction of canvas HEIGHT
// logoTopPct   : logo center as fraction of canvas HEIGHT
// contentPadX  : horizontal padding inside canvas (pixels at 1080-base)
// contentPadTop: top of the content zone as fraction of canvas HEIGHT
export interface FormatLayoutConfig {
  iconCenterYPct:  number   // icon center Y / canvas height
  logoTopPct:      number   // logo top edge Y / canvas height
  logoCenterYPct:  number   // logo center Y / canvas height
  contentStartYPct: number  // content zone start Y / canvas height (below date)
}

export const FORMAT_LAYOUT: Record<HelpdeskFormat, FormatLayoutConfig> = {
  '1:1':  { iconCenterYPct: 0.218, logoCenterYPct: 0.833, logoTopPct: 0.787, contentStartYPct: 0.130 },
  '9:16': { iconCenterYPct: 0.237, logoCenterYPct: 0.590, logoTopPct: 0.562, contentStartYPct: 0.175 },
  '16:9': { iconCenterYPct: 0.176, logoCenterYPct: 0.790, logoTopPct: 0.743, contentStartYPct: 0.085 },
}
