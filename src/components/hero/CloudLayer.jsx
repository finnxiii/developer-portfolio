import CloudGroup from "./CloudGroup";
import { mobileClouds, tabletClouds, laptopClouds, desktopClouds } from "../../data/heroSceneData";

function renderClouds(clouds) {
	return clouds.map((cloud, index) => <CloudGroup key={index} {...cloud} />);
}

function CloudLayer() {
	return (
		<div className="absolute inset-0">
			<div className="absolute inset-0 sm:hidden">{renderClouds(mobileClouds)}</div>
			<div className="absolute inset-0 hidden sm:block lg:hidden">{renderClouds(tabletClouds)}</div>
			<div className="absolute inset-0 hidden lg:block xl:hidden">{renderClouds(laptopClouds)}</div>
			<div className="absolute inset-0 hidden xl:block">{renderClouds(desktopClouds)}</div>
		</div>
	);
}

export default CloudLayer;
