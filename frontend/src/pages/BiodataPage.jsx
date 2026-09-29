import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBiodata } from '../api/client';
import BiodataCard from '../components/BiodataCard';
import {
  User,
  Briefcase,
  Users,
  Compass,
  Phone,
  Sparkles,
  Printer,
  ShieldCheck,
  MapPin,
  HeartHandshake,
  Camera,
  Images,
  ArrowRight
} from 'lucide-react';

export default function BiodataPage() {
  const [biodata, setBiodata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBiodata()
      .then((data) => {
        setBiodata(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load biodata', err);
        setError('Failed to fetch finalized biodata from backend.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--primary-navy)' }}>
          बायोडेटा लोड होत आहे / Loading biodata...
        </div>
      </div>
    );
  }

  if (error || !biodata) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ color: '#C62828', fontSize: '1.1rem' }}>{error || 'बायोडेटा उपलब्ध नाही / Unable to load biodata.'}</div>
      </div>
    );
  }

  const { personal, education_profession, family, astrology, contact } = biodata;

  const personalItems = [
    { labelMarathi: 'पूर्ण नाव', labelEnglish: 'Full Name', valueMarathi: personal.full_name_marathi, valueEnglish: personal.full_name },
    { labelMarathi: 'जन्मतारीख', labelEnglish: 'Date of Birth', valueMarathi: '२४ सप्टेंबर १९९९', valueEnglish: '24 September 1999' },
    { labelMarathi: 'जन्मवार', labelEnglish: 'Day of Birth', valueMarathi: personal.day_of_birth_marathi || 'शुक्रवार', valueEnglish: personal.day_of_birth || 'Friday' },
    { labelMarathi: 'जन्मवेळ', labelEnglish: 'Time of Birth', valueMarathi: personal.time_of_birth_marathi || 'सकाळी ११:०५', valueEnglish: personal.time_of_birth || '11:05 am' },
    { labelMarathi: 'जन्मस्थळ', labelEnglish: 'Place of Birth', valueMarathi: personal.place_of_birth_marathi || 'नागपूर, महाराष्ट्र', valueEnglish: personal.place_of_birth || 'Nagpur, Maharashtra' },
    { labelMarathi: 'उंची', labelEnglish: 'Height', valueMarathi: '६ फूट ३ इंच', valueEnglish: "6'3\" (190.5 cm)" },
    { labelMarathi: 'वर्ण', labelEnglish: 'Complexion', valueMarathi: personal.complexion_marathi || 'गौर (गोरा)', valueEnglish: personal.complexion || 'Fair' },
    { labelMarathi: 'रक्तगट', labelEnglish: 'Blood Group', valueMarathi: 'A+', valueEnglish: 'A+' },
    { labelMarathi: 'वैवाहिक स्थिती', labelEnglish: 'Marital Status', valueMarathi: personal.marital_status_marathi || 'अविवाहित', valueEnglish: personal.marital_status || 'Never Married' },
    { labelMarathi: 'आहार', labelEnglish: 'Diet', valueMarathi: personal.diet_marathi || 'शाकाहारी', valueEnglish: personal.diet || 'Vegetarian' },
  ];

  const eduItems = [
    {
      labelMarathi: 'शिक्षण',
      labelEnglish: 'Highest Qualification',
      valueMarathi: education_profession.highest_qualification_marathi || 'एमसीए (मास्टर इन कॉम्प्युटर ॲप्लिकेशन)',
      valueEnglish: education_profession.highest_qualification || 'MCA (Master in Computer Application)'
    },
    {
      labelMarathi: 'व्यवसाय',
      labelEnglish: 'Occupation',
      valueMarathi: education_profession.occupation_marathi || 'आयटी सॉफ्टवेअर सेवा',
      valueEnglish: education_profession.occupation || 'IT Software Service'
    },
    {
      labelMarathi: 'सध्याचे काम',
      labelEnglish: 'Current Role',
      valueMarathi: education_profession.current_role_marathi || 'एआय आणि पायथन सॉफ्टवेअर डेव्हलपर',
      valueEnglish: education_profession.current_role || 'AI & Python Software Developer'
    },
    {
      labelMarathi: 'वार्षिक उत्पन्न',
      labelEnglish: 'Annual Income',
      valueMarathi: education_profession.annual_income_marathi || '₹८.५ लाख',
      valueEnglish: education_profession.annual_income || '₹8.5 Lakh'
    },
    {
      labelMarathi: 'कामाचे ठिकाण',
      labelEnglish: 'Work Location',
      valueMarathi: education_profession.work_location_marathi || 'नागपूर',
      valueEnglish: education_profession.work_location || 'Nagpur'
    },
  ];

  const familyItems = [
    {
      labelMarathi: 'वडिलांचे नाव',
      labelEnglish: "Father's Name",
      valueMarathi: family.father_name_marathi || 'श्री हेमंतराव अनंतराव जोशी',
      valueEnglish: family.father_name || 'Shri Hemantrao Anantrao Joshi'
    },
    {
      labelMarathi: 'वडिलांचा व्यवसाय',
      labelEnglish: "Father's Occupation",
      valueMarathi: family.father_occupation_marathi || 'वाहन निर्मिती कंपनीतील निवृत्त आयटी प्रमुख',
      valueEnglish: family.father_occupation || 'Retired IT Head from Automobile company'
    },
    {
      labelMarathi: 'आईचे नाव',
      labelEnglish: "Mother's Name",
      valueMarathi: family.mother_name_marathi || 'श्रीमती बागेश्री जोशी',
      valueEnglish: family.mother_name || 'Mrs. Bageshree Joshi'
    },
    {
      labelMarathi: 'आईचा व्यवसाय',
      labelEnglish: "Mother's Occupation",
      valueMarathi: family.mother_occupation_marathi || 'गृहिणी',
      valueEnglish: family.mother_occupation || 'Housewife'
    },
    {
      labelMarathi: 'भावंडे',
      labelEnglish: 'Siblings',
      valueMarathi: family.siblings_marathi || 'बहीण - १ (विशेष क्षमता असलेले मूल)',
      valueEnglish: family.siblings || 'Sister - 1 (special ability child)'
    },
    {
      labelMarathi: 'मूळ गाव',
      labelEnglish: 'Family Native Place',
      valueMarathi: family.native_place_marathi || 'नागपूर, महाराष्ट्र',
      valueEnglish: family.native_place || 'Nagpur, Maharashtra'
    },
    {
      labelMarathi: 'कौटुंबिक स्थिती',
      labelEnglish: 'Family Type / Status',
      valueMarathi: family.family_type_marathi || 'सुस्थितीत',
      valueEnglish: family.family_type || 'Well settled'
    },
  ];

  const astroItems = [
    {
      labelMarathi: 'राशी',
      labelEnglish: 'Rashi (Moon Sign)',
      valueMarathi: 'कुंभ',
      valueEnglish: 'Kumbha (Aquarius)'
    },
    {
      labelMarathi: 'नक्षत्र',
      labelEnglish: 'Nakshatra',
      valueMarathi: 'पूर्व भाद्रपदा (चरण १)',
      valueEnglish: 'Purva Bhadrapada (Charan 1)'
    },
    {
      labelMarathi: 'गोत्र',
      labelEnglish: 'Gotra',
      valueMarathi: astrology.gotra_marathi || 'चंद्रत्र',
      valueEnglish: astrology.gotra || 'Chandratra'
    },
    {
      labelMarathi: 'कुलदेवता',
      labelEnglish: 'Kuladevata',
      valueMarathi: astrology.kuladevata_marathi || 'पिंगलाई देवी, नेरपिंगलाई आणि व्यंकटेश बालाजी',
      valueEnglish: astrology.kuladevata || 'Pinglai Devi, Nerpinglai And Venkatesh Balaji'
    },
    {
      labelMarathi: 'लग्न',
      labelEnglish: 'Lagna (Ascendant)',
      valueMarathi: astrology.lagna_marathi || 'वृश्चिक',
      valueEnglish: `${astrology.lagna || 'Vrishchik'} (${astrology.lagna_english || 'Scorpio'})`
    },
    {
      labelMarathi: 'मंगळ स्थिती',
      labelEnglish: 'Manglik Status',
      valueMarathi: 'नाही (मंगळ दोष नाही)',
      valueEnglish: 'No (Non-Manglik)'
    },
  ];

  const contactItems = [
    {
      labelMarathi: 'पत्ता',
      labelEnglish: 'Residential Address',
      valueMarathi: contact.address_marathi || 'अभ्यंकर नगर, नागपूर, महाराष्ट्र',
      valueEnglish: contact.address || 'Abhyankar Nagar, Nagpur, Maharashtra'
    },
    {
      labelMarathi: 'संपर्क क्रमांक',
      labelEnglish: 'Contact Number',
      valueMarathi: '९८२२२३५०६७ , ९४०३५९०८९०, ८२०८००७६८८',
      valueEnglish: '9822235067, 9403590890, 8208007688'
    },
    {
      labelMarathi: 'ईमेल',
      labelEnglish: 'Email Address',
      value: contact.email || 'sumantjoshi24@gmail.com'
    },
  ];

  return (
    <div className="container" style={{ padding: 'clamp(20px, 4vw, 36px) clamp(10px, 3vw, 20px) 60px clamp(10px, 3vw, 20px)' }}>
      {/* Top Banner / Certificate Header */}
      <div className="card" style={{
        textAlign: 'center',
        padding: 'clamp(24px, 4vw, 36px) clamp(14px, 3vw, 24px) clamp(20px, 3vw, 28px) clamp(14px, 3vw, 24px)',
        marginBottom: '30px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FDFCFA 100%)',
        border: '1.5px solid var(--border-gold)',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(154, 106, 30, 0.08)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--accent-gold)',
          fontWeight: '700',
          fontSize: '1.05rem',
          letterSpacing: '0.08em',
          marginBottom: '8px',
          fontFamily: 'var(--font-devanagari)'
        }}>
          ॥ श्री गणेशाय नमः ॥
        </div>

        <div style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          letterSpacing: '0.08em',
          marginBottom: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--accent-gold-dark)' }}>
            विवाह जुळवणी बायोडेटा
          </span>
          <span style={{ color: 'var(--border-medium)' }}>/</span>
          <span style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            MARRIAGE BIODATA
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.3rem)',
          fontWeight: 800,
          color: 'var(--primary-navy)',
          marginBottom: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span style={{ fontFamily: 'var(--font-devanagari)' }}>
            {personal.full_name_marathi}
          </span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 400, fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)' }}>/</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.3rem, 4.5vw, 2.1rem)' }}>
            {personal.full_name}
          </span>
        </h1>

        {/* Quick summary chips in Marathi / English */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          margin: '18px 0 24px 0'
        }}>
          <span className="badge badge-navy">
            <Briefcase size={13} /> एआय आणि पायथन सॉफ्टवेअर डेव्हलपर / AI & Python Software Developer
          </span>
          <span className="badge badge-gold">
            <Compass size={13} /> कुंभ &bull; पूर्व भाद्रपदा / Kumbha &bull; Purva Bhadrapada
          </span>
          <span className="badge badge-success">
            <ShieldCheck size={13} /> मंगळ: नाही / Manglik: No
          </span>
          <span className="badge badge-navy">
            <MapPin size={13} /> नागपूर / Nagpur
          </span>
        </div>

        {/* Action buttons */}
        <div className="no-print btn-group-responsive">
          <Link to="/photos" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem', border: '1.5px solid var(--accent-gold)', color: 'var(--primary-navy)' }}>
            <Camera size={18} color="var(--accent-gold)" />
            <span>छायाचित्रे पहा / View Photos</span>
          </Link>
          <Link to="/match" className="btn btn-gold" style={{ padding: '12px 28px', fontSize: '1rem' }}>
            <Sparkles size={18} />
            <span>पत्रिका जुळवणी करा / Match Partner Kundali</span>
          </Link>
          <button onClick={() => window.print()} className="btn btn-secondary">
            <Printer size={16} />
            <span>बायोडेटा प्रिंट करा / Print Biodata</span>
          </button>
        </div>
      </div>

      {/* Main Biodata Content Cards with Marathi / English */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <BiodataCard
          titleMarathi="१. वैयक्तिक माहिती"
          titleEnglish="1. Personal Details"
          icon={User}
          items={personalItems}
        />

        <BiodataCard
          titleMarathi="२. शिक्षण व व्यवसाय"
          titleEnglish="2. Education & Profession"
          icon={Briefcase}
          items={eduItems}
          noteMarathi="मायक्रोप्रो अंतर्गत विकसित हॉस्पीकेअर (हॉस्पिटल इन्फॉर्मेशन मॅनेजमेंट सिस्टीम - HIMS) आणि क्लिनिकल डिसिजन सपोर्ट सिस्टीम (CDSS) प्रकल्पावर कार्यरत; तसेच क्लायंट-फेसिंग फुल-स्टॅक वेब व एंटरप्राइझ सॉफ्टवेअर डेव्हलपमेंट."
          noteEnglish="Works on Hospycare, a Hospital Information Management System (HIMS) and Clinical Decision Support System (CDSS) developed under Micropro; also undertakes client-facing full-stack web and enterprise software development."
        />

        <BiodataCard
          titleMarathi="३. कौटुंबिक माहिती"
          titleEnglish="3. Family Details"
          icon={Users}
          items={familyItems}
        />

        <BiodataCard
          titleMarathi="४. ज्योतिष माहिती (जन्मपत्रिकेनुसार)"
          titleEnglish="4. Astrological Details (as per Janam Patrika)"
          icon={Compass}
          items={astroItems}
          noteMarathi="अष्टकूट ३६ गुण मिलन व कुंडली जुळवणीसाठी जन्मपत्रिकेनुसार सर्व ज्योतिषीय तपशील पडताळलेले आहेत."
          noteEnglish="All astrological parameters verified against Janam Patrika for classical 36-point Ashtakoot Gun Milan evaluation."
        />

        <BiodataCard
          titleMarathi="५. संपर्क माहिती"
          titleEnglish="5. Contact Details"
          icon={Phone}
          items={contactItems}
        />

        {/* Section 6: Personal & Family Photographs */}
        <div className="card" style={{ marginBottom: '24px', border: '1.5px solid var(--border-gold)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '14px',
            borderBottom: '1.5px solid var(--border-gold)',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)'
              }}>
                <Camera size={20} />
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.2rem',
                  color: 'var(--primary-navy)',
                  margin: 0,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  <span style={{ fontFamily: 'var(--font-devanagari)' }}>६. छायाचित्रे व कौटुंबिक फोटो</span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 400 }}>/</span>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    6. Personal & Family Photographs
                  </span>
                </h2>
              </div>
            </div>

            <Link to="/photos" className="btn btn-gold btn-sm">
              <Images size={15} />
              <span>सर्व छायाचित्रे पहा / View All Photos</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Quick Preview Thumbnail Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))',
            gap: '12px',
            marginBottom: '14px'
          }}>
            <Link to="/photos" style={{ textDecoration: 'none', position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', display: 'block' }}>
              <img src="/img1.png" alt="Sumant Joshi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '0.72rem', textAlign: 'center' }}>
                वैयक्तिक / Personal
              </div>
            </Link>
            <Link to="/photos" style={{ textDecoration: 'none', position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', display: 'block' }}>
              <img src="/img2.jpeg" alt="Sumant Joshi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '0.72rem', textAlign: 'center' }}>
                वैयक्तिक / Personal
              </div>
            </Link>
            <Link to="/photos" style={{ textDecoration: 'none', position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', display: 'block' }}>
              <img src="/img3.jpeg" alt="Sumant Joshi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '0.72rem', textAlign: 'center' }}>
                वैयक्तिक / Personal
              </div>
            </Link>
            <Link to="/photos" style={{ textDecoration: 'none', position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', display: 'block' }}>
              <img src="/img4.JPG" alt="Sumant Joshi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px', background: 'rgba(0,0,0,0.65)', color: '#FFFFFF', fontSize: '0.72rem', textAlign: 'center' }}>
                वैयक्तिक / Personal
              </div>
            </Link>
            <Link to="/photos" style={{ textDecoration: 'none', position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--accent-gold)', display: 'block' }}>
              <img src="/img5.JPG" alt="Joshi Family" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px', background: 'rgba(154,106,30,0.9)', color: '#FFFFFF', fontSize: '0.72rem', textAlign: 'center', fontWeight: 700 }}>
                कौटुंबिक / Family
              </div>
            </Link>
            <Link to="/photos" style={{ textDecoration: 'none', position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--accent-gold)', display: 'block' }}>
              <img src="/img6.jpeg" alt="Joshi Family" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px', background: 'rgba(154,106,30,0.9)', color: '#FFFFFF', fontSize: '0.72rem', textAlign: 'center', fontWeight: 700 }}>
                कौटुंबिक / Family
              </div>
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '6px' }}>
            <Link to="/photos" style={{ color: 'var(--accent-gold-dark)', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>सर्व छायाचित्रे हाय-रिझोल्यूशनमध्ये पाहण्यासाठी येथे क्लिक करा / Click to open full Photo Gallery</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Match CTA in Marathi / English */}
      <div className="card no-print" style={{
        marginTop: '30px',
        textAlign: 'center',
        backgroundColor: 'var(--bg-gold-light)',
        border: '1.5px dashed var(--accent-gold)',
        padding: '30px'
      }}>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '8px' }}>
          वधूसोबत पत्रिका व गुण मिलन तपासा / Check Compatibility with Prospective Partner
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 18px auto', fontSize: '0.95rem' }}>
          पारंपारिक अष्टकूट ३६ गुणांचे मिलन, नाडी दोष, भकूट दोष आणि मंगळ स्थितीची अचूक पडताळणी करा.
          <br />
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Instantly evaluate 36-point Ashtakoot compatibility, verify Nadi/Bhakoot/Manglik doshas, and generate an audit record.
          </span>
        </p>
        <Link to="/match" className="btn btn-gold" style={{ padding: '12px 28px' }}>
          <HeartHandshake size={18} />
          <span>गुण मिलन सुरू करा / Start Gun Milan Evaluation</span>
        </Link>
      </div>
    </div>
  );
}
