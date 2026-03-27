const Navbar = () => {
	const navItems = [
		{ label: "About", href: "#about" },
		{ label: "Skills", href: "#skills" },
		{ label: "Projects", href: "#projects" },
		{ label: "Contact", href: "#contact" },
	];

	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<a href="#home" className="text-lg font-semibold tracking-wide text-white transition hover:text-purple-400">
					finnxiii
				</a>

				<ul className="flex items-center gap-6">
					{navItems.map((item) => (
						<li key={item.label}>
							<a href={item.href} className="text-sm font-medium text-white/80 transition hover:text-purple-400">
								{item.label}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
};

export default Navbar;
