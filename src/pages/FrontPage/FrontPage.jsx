import { useEffect } from "react";
import SEOHead from "../../components/ui/SEOHead/SEOHead";
import StageSection from "../../components/stage/StageSection";
import { useQuack } from "../../components/quack/QuackContext";
import { FrontPageProvider } from "./FrontPageContext";
import HeroScene from "./HeroScene";
import HeroSection from "./HeroSection";
import BugScene from "./BugScene";
import BugSection from "./BugSection";
import WorkScene from "./WorkScene";
import WorkSection from "./WorkSection";
import LogScene from "./LogScene";
import LogSection from "./LogSection";
import TestsScene from "./TestsScene";
import TestsSection from "./TestsSection";
import NowScene from "./NowScene";
import NowSection from "./NowSection";
import ContactScene from "./ContactScene";
import ContactSection from "./ContactSection";
import "./FrontPage.scss";

const FRONT_QUIPS = [
	"Quack! Drag me anywhere.",
	"Use the dots to jump around. I just walk.",
	"Try the bug. I believe in you.",
	"The contact section has the best hover.",
];

function FrontPageInner() {
	const { setQuips } = useQuack();
	useEffect(() => { setQuips(FRONT_QUIPS); }, [setQuips]);

	return (
		<>
			<SEOHead
				title="Naing Htoo Lwin — finnxiii.dev"
				description="Software engineering portfolio of Naing Htoo Lwin: selected work, case studies and field notes."
			/>
			<StageSection id="home" fn="home()" ln="01" bg="#F4F1EA" dark={false} scene={<HeroScene />}>
				<HeroSection />
			</StageSection>
			<StageSection id="bug" fn="findTheBug()" ln="12" bg="#F7F4EC" dark={false} scene={<BugScene />}>
				<BugSection />
			</StageSection>
			<StageSection id="work" fn="caseStudies()" ln="24" bg="#F4F1EA" dark={false} scene={<WorkScene />}>
				<WorkSection />
			</StageSection>
			<StageSection id="log" fn="gitLog()" ln="36" bg="#EEEAE1" dark={false} scene={<LogScene />}>
				<LogSection />
			</StageSection>
			<StageSection id="tests" fn="howIWork()" ln="48" bg="#1F1D1A" dark={true} scene={<TestsScene />}>
				<TestsSection />
			</StageSection>
			<StageSection id="now" fn="now()" ln="60" bg="#EEEAE1" dark={false} scene={<NowScene />}>
				<NowSection />
			</StageSection>
			<StageSection id="contact" fn="contact()" ln="72" bg="#1A1917" dark={true} scene={<ContactScene />}>
				<ContactSection />
			</StageSection>
		</>
	);
}

export default function FrontPage() {
	return (
		<FrontPageProvider>
			<FrontPageInner />
		</FrontPageProvider>
	);
}
