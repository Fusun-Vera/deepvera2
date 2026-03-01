import React, { useState } from 'react';

// Sirket Infoleri
export const COMPANY_INFO = {
  title: 'AI Muzik Yazilim Pazarlama Ithalat Ihracat Ticaret Limited Sirketi',
  adres: 'Muskebi Mahallesi, Palamut Sokak No:2D Ortakent Bodrum Mugla',
  andrgiDairesi: 'Bodrum',
  andrgiNo: '0102276448',
  phone: '',
  email: 'ai@deepandra.com.tr',
  website: 'deep-andra.andrcel.app',
};

interface LegalPagesProps {
  page: 'kvk' | 'terms' | 'membership' | 'company';
  onClose: () => void;
}

const LegalPages: React.FC<LegalPagesProps> = ({ page, onClose }) => {
  const renderContent = () => {
    if (page === 'kvk') {
      return (
        <div className="space-y-6">
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900">KVKK Aydinlatma Metni</h2>
            <p className="text-sm text-slate-500 mt-1">Kisisel Verilerin Korunmasi Kanunu Kapsaminda</p>
          </div>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <h3 className="font-black text-blue-800 text-sm mb-2">1. Veri Sorumlusu</h3>
              <p>6698 sayili Kisisel Verilerin Korunmasi Kanunu kapsaminda andri sorumlusu:</p>
              <div className="mt-2 space-y-1 text-xs font-medium">
                <p><strong>Title:</strong> {COMPANY_INFO.title}</p>
                <p><strong>Adres:</strong> {COMPANY_INFO.adres}</p>
                <p><strong>Vergi Dairesi:</strong> {COMPANY_INFO.andrgiDairesi} / {COMPANY_INFO.andrgiNo}</p>
                <p><strong>Email:</strong> {COMPANY_INFO.email}</p>
              </div>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">2. Islenen Kisisel Veriler</h3>
              <p>Hizmetlerimizi sunmak amaciyla asagidaki kisisel andrileriniz islenmektedir:</p>
              <ul className="mt-2 space-y-1 ml-4 list-disc text-xs">
                <li>Kimlik bilgileri (ad, soyad, kullanici adi)</li>
                <li>Iletisim bilgileri (email adresi, phone numarasi)</li>
                <li>Islem bilgileri (platform kullanim gecmisi, search gecmisi)</li>
                <li>Odeme bilgileri (invoice bilgileri, odeme gecmisi - kart bilgileri islenmez)</li>
                <li>Teknik andriler (IP adresi, tarayici bilgisi, oturum andrileri)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">3. Kisisel Verilerin Isleme Amaci</h3>
              <p>Kisisel andrileriniz asagidaki amaclarla islenmektedir:</p>
              <ul className="mt-2 space-y-1 ml-4 list-disc text-xs">
                <li>Hizmet sunumu and kullanici hesabi olusturulup yonetilmesi</li>
                <li>Odeme islemlerinin gercaddstirilmesi</li>
                <li>Yasal yukumluluklerimizin yerine getirilmesi</li>
                <li>Guandnlik and dolandiricilik onleme</li>
                <li>Kullanici deneyiminin iyilestirilmesi</li>
                <li>Istatistiksel analysisler and reportlama</li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">4. Kisisel Verilerin Aktarimi</h3>
              <p>Kisisel andrileriniz; odeme islemleri icin PayTR Odeme Hizmetleri A.S.'ye, yasal zorunluluk halinde yetkili kamu kurum and kuruluslarindan baskasina aktarilmamaktadir.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">5. Kisisel Veri Sahiplerinin Haklari</h3>
              <p>KVKK'nin 11. maddesi uyarinca asagidaki haklara sahipsiniz:</p>
              <ul className="mt-2 space-y-1 ml-4 list-disc text-xs">
                <li>Kisisel andrilerinizin islenip islenmedigini ogrenme</li>
                <li>Islenmisse bilgi talep etme</li>
                <li>Isleme amacini and amacina uygun kullanilip kullanilmadigini ogrenme</li>
                <li>Yurt ici or yurt disinda aktarildigi ucuncu kisiler hakkinda bilgi alma</li>
                <li>Eksik or yanlis islenmisse duzeltilmesini isteme</li>
                <li>Deleteinmesini or yok edilmesini isteme</li>
                <li>Islemin ucuncu kisilere bildirilmesini isteme</li>
                <li>Kanuna aykiri islenmesi sebebiyle zarara ugranmasi halinde zararin giderilmesini talep etme</li>
              </ul>
              <p className="mt-2 text-xs">Haklarinizi kullanmak icin <strong>{COMPANY_INFO.email}</strong> adresine basvurabilirsiniz.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">6. Cerezler and Izleme Teknolojileri</h3>
              <p className="text-xs">Platformumuz oturum yonetimi and kullanici deneyimi icin yerel depolama (localStorage / sessionStorage) kullanmaktadir. Herhangi bir ucuncu taraf reklamcilik cerezi kullanilmamaktadir.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
              <p><strong>Son Guncelleme:</strong> Ocak 2025</p>
              <p className="mt-1">Bu aydinlatma metni hakkinda sorulariniz icin {COMPANY_INFO.email} adresine ulasabilirsiniz.</p>
            </div>
          </div>
        </div>
      );
    }
    if (page === 'terms') {
      return (
        <div className="space-y-6">
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900">Kullanim Kosullari</h2>
            <p className="text-sm text-slate-500 mt-1">Hizmet Sozlesmesi and Kullanim Sartlari</p>
          </div>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <strong>Onemli:</strong> Bu platformu kullanmaya baslamadan once asagidaki kullanim kosullarini dikkatlice okuyunuz.
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">1. Taraflar</h3>
              <p className="text-xs">Bu sozlesme; <strong>{COMPANY_INFO.title}</strong> ile platformumuzu kullanan gercek or tuzel kisi arasinda akdedilmistir.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">2. Hizmet Tanimi</h3>
              <p className="text-xs">DeepVera; yapay zeka destekli B2B company search, istihbarat toplama and otonom email pazarlama platformudur.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">3. Kullanici Yukumlulukleriy</h3>
              <ul className="mt-1 space-y-1 ml-4 list-disc text-xs">
                <li>Platform yalnizca yasal ticari amaclar icin kullanilabilir.</li>
                <li>Spam or istenmeyen toplu email gonderimi yasaktir.</li>
                <li>Elde edilen andriler ucuncu sahislarla paylasilamaz.</li>
                <li>Platform araciligiyla hukuka aykiri faaliyette bulunulamaz.</li>
                <li>Hesap bilgileri gizli tutulmali and baskasina devredilemez.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">4. Token and Odeme Politikasi</h3>
              <ul className="mt-1 space-y-1 ml-4 list-disc text-xs">
                <li>Token satin alimlari iade edilmez.</li>
                <li>Token bakiyesi hesap cancelinde gecersiz sayilir.</li>
                <li>Odeme islemleri PayTR altyapisi uzerinden gercaddstirilir.</li>
                <li>Invoice, odeme gercaddstikten sonra belirtilen email adresine iletilir.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">5. Fikri Mulkiyet</h3>
              <p className="text-xs">Platform, yazilim, tasarim and iceriklerin tum fikri mulkiyet haklari Sirkete aittir.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">6. Sorumluluk Sinirlamasi</h3>
              <p className="text-xs">Platform "oldugu gibi" sunulmaktadir. Sirket; platform kesintileri, andri kayiplari or ucuncu taraf entegrasyonlarindan kaynaklanan zararlardan sorumlu tutulamaz.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">7. Fesih</h3>
              <p className="text-xs">Sirket, kullanim kosullarini ihlal eden hesaplari onceden bildirimde bulunmaksizin askiya alma or kalici olarak closema hakkini sakli tutar.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">8. Uygulanacak Hukuk</h3>
              <p className="text-xs">Bu sozlesme Turkiye Cumhuriyeti hukumlerine tabidir. Uyusmazliklarda Bodrum Mahkemeleri and Icra Daireleri yetkilidir.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
              <p><strong>Son Guncelleme:</strong> Ocak 2025 | <strong>Versiyon:</strong> 1.0</p>
            </div>
          </div>
        </div>
      );
    }
    if (page === 'membership') {
      return (
        <div className="space-y-6">
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900">Uyelik Sozlesmesi</h2>
            <p className="text-sm text-slate-500 mt-1">Hesap olusturma and uyelik sartlari</p>
          </div>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
              <strong>Dikkat:</strong> Hesap olusturarak asagidaki uyelik sozlesmesini and kullanim kosullarini kabul etmis sayilirsiniz.
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">1. Uyelik Kosullari</h3>
              <ul className="mt-1 space-y-1 ml-4 list-disc text-xs">
                <li>18 yasindan buyuk olmak or yasal temsilci onayi bulunmak.</li>
                <li>Gecerli bir email adresi saglamak.</li>
                <li>Gercek and dogrulanabilir bilgiler andrmek.</li>
                <li>Her kisinin yalnizca bir hesabi olabilir.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">2. Hesap Guandnligi</h3>
              <p className="text-xs">Sifrenizi gizli tutmak and hesabinizda gercaddsen tum islemlerden sorumlu olmak size aittir. Yetkisiz erisim statusunda derhal {COMPANY_INFO.email} adresini bilgilendirin.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">3. Ucretsiz Baslangic Paketi</h3>
              <p className="text-xs">New uyelere 100 adet ucretsiz DV Token taninir. Bu tokenler hesap olusturulduktan itibaren 90 gun icerisinde kullanilmazsa gecersiz sayilir.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">4. Verilerin Islenmesi</h3>
              <p className="text-xs">Uyelik sirasinda toplanan kisisel andriler KVKK Aydinlatma Metnimiz kapsaminda islenmektedir.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">5. Iletisim Izni</h3>
              <p className="text-xs">Uyelik ile birlikte hizmet bildirimleri, sistem guncellemeleri and onemli duyurulara iliskin emaillar almanizi onayliyorsunuz.</p>
            </div>
            <div>
              <h3 className="font-black text-slate-800 mb-2">6. Hesap Closema</h3>
              <p className="text-xs">Hesabinizi istediginiz zaman {COMPANY_INFO.email} adresine talep ileterek closeabilirsiniz.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
              <p>Bu sozlesme hakkinda sorulariniz icin: <strong>{COMPANY_INFO.email}</strong></p>
            </div>
          </div>
        </div>
      );
    }
    if (page === 'company') {
      return (
        <div className="space-y-6">
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-black text-white">DV</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">Sirket Infoleri</h2>
            <p className="text-sm text-slate-500 mt-1">Resmi Ticaret Sicili Infoleri</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Sirket Titlei', value: COMPANY_INFO.title, icon: '🏢' },
                { label: 'Adres', value: COMPANY_INFO.adres, icon: '📍' },
                { label: 'Vergi Dairesi', value: COMPANY_INFO.andrgiDairesi, icon: '🏛️' },
                { label: 'Vergi Numarasi', value: COMPANY_INFO.andrgiNo, icon: '🔢' },
                { label: 'Phone', value: COMPANY_INFO.phone, icon: '📞' },
                { label: 'Email', value: COMPANY_INFO.email, icon: '✉️' },
                { label: 'Website', value: COMPANY_INFO.website, icon: '🌐' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl oandrflow-hidden flex flex-col" style={{ maxHeight: 'min(92dvh, 700px)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div />
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 hoandr:bg-slate-200 text-slate-400 hoandr:text-slate-700 rounded-xl flex items-center justify-center transition-all text-lg font-bold"
          >&times;</button>
        </div>
        <div className="flex-1 oandrflow-y-auto p-6">
          {renderContent()}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full h-11 bg-slate-900 text-white rounded-xl font-black text-[12px] uppercase tracking-wider hoandr:bg-blue-600 transition-all"
          >
            Anladim, Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalPages;
