import { Container } from "react-bootstrap";

const BrandsSection = () => {
  // You can replace these with real brand names and logos later
  const partners = [
    { name: "Merck", logo: "https://i.pinimg.com/736x/5e/f4/64/5ef464b04bea1c570f97a268c3fc4b72.jpg" },
    { name: "Labconco", logo: "https://i.pinimg.com/736x/47/f8/9f/47f89faaf42799649c3652292d385113.jpg" },
    { name: "Eppendorf", logo: "https://d17eythm3w95tp.cloudfront.net/media/138/conversions/eppendorf-logo-vector-small.webp" },
    { name: "Hach", logo: "https://i.pinimg.com/736x/33/05/36/330536548ae3c273980962260b3eae82.jpg" },
    // Add more real partners as needed
  ];

  return (
    <section className="partners-section py-5 bg-white">
      <Container>
        <div className="text-center mb-5">
          <h2 
            className="fw-bold mb-3" 
            style={{ color: "#004E5C", fontSize: "2.4rem" }}
          >
            Trusted by Leading Brands
          </h2>
          <p className="text-muted lead" style={{ maxWidth: "680px", margin: "0 auto" }}>
            We partner with world-renowned manufacturers to bring you the highest quality laboratory and scientific supplies.
          </p>
        </div>

        <div className="d-flex flex-wrap justify-content-center align-items-center gap-5 gap-md-5">
          {partners.map((brand) => (
            <div 
              key={brand.name}
              className="partner-logo-wrapper"
              title={brand.name}
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="partner-logo"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* === Styles === */}
        <style>{`
          .partners-section {
            background: #ffffff;
          }

          .partner-logo-wrapper {
            transition: all 0.3s ease;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            background:#01446F ;
            border: 1px solid #e9ecef;
            min-width: 140px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .partner-logo-wrapper:hover {
            transform: translateY(-6px);
            background: #ffffff;
            box-shadow: 0 10px 30px rgba(0, 78, 92, 0.12);
            border-color: rgba(0, 78, 92, 0.2);
          }

          .partner-logo {
            max-height: 80px;
            max-width: 180px;
            width: auto;
            height: auto;
            object-fit: contain;
            transition: all 0.35s ease;
            filter: grayscale(30%) opacity(0.9);
          }

          .partner-logo-wrapper:hover .partner-logo {
            filter: grayscale(0%) opacity(1);
            transform: scale(1.05);
          }

          @media (max-width: 768px) {
            .partner-logo-wrapper {
              min-width: 120px;
              padding: 0.75rem 1rem;
            }
            .partner-logo {
              max-height: 65px;
              max-width: 140px;
            }
          }

          @media (max-width: 576px) {
            .partner-logo-wrapper {
              min-width: 100px;
              padding: 0.5rem 0.75rem;
            }
            .partner-logo {
              max-height: 50px;
              max-width: 110px;
            }
            .gap-5 {
              gap: 1.5rem !important;
            }
          }
        `}</style>
      </Container>
    </section>
  );
};

export default BrandsSection;