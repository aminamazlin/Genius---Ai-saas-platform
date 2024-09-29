import LandingNavbar from "@components/Landing-navbar";
import LandingHero from "@components/Landing-hero";
import LandingContent from "@components/Landing-content";

const LandingPage = () => {
  return (
    <div className="h-full">
      <LandingNavbar/>
      <LandingHero/>
      <LandingContent/>
    </div>
  );
}

export default LandingPage