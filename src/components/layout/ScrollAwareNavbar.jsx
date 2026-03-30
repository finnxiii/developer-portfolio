import { useEffect, useState } from "react";
import Navbar from "../Navbar";

function ScrollAwareNavbar({ scrollY }) {
	const [visible, setVisible] = useState(true);
	const [lightText, setLightText] = useState(true);
	const [lastY, setLastY] = useState(0);

	useEffect(() => {
		const unsubscribe = scrollY.on("change", (currentY) => {
			if (currentY <= 40) {
				setVisible(true);
			} else if (currentY > lastY) {
				setVisible(false);
			} else if (currentY < lastY) {
				setVisible(true);
			}

			// Adjust threshold if your transition becomes longer/shorter
			setLightText(currentY < 1700);

			setLastY(currentY);
		});

		return () => unsubscribe();
	}, [scrollY, lastY]);

	return <Navbar visible={visible} lightText={lightText} />;
}

export default ScrollAwareNavbar;
