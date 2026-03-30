function CloudGroup({ wrapperClass, sizeClass, blocks }) {
	return (
		<div className={`absolute ${wrapperClass}`}>
			<div className={`relative ${sizeClass}`}>
				{blocks.map((block, index) => (
					<span
						key={index}
						className={`absolute ${block.color}`}
						style={{
							left: `${block.left}px`,
							top: `${block.top}px`,
							width: `${block.width}px`,
							height: `${block.height}px`,
						}}
					/>
				))}
			</div>
		</div>
	);
}

export default CloudGroup;
