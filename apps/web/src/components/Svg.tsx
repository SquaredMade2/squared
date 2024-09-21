export const high = () => {
	return (
		<svg
			fill="#6B6F76"
			viewBox="0 0 16 16"
			aria-label="High Priority"
			width={16}
			height={16}
		>
			<title>Icon</title>
			<rect x="1" y="8" width="3" height="6" rx="1" />
			<rect x="6" y="5" width="3" height="9" rx="1" />
			<rect x="11" y="2" width="3" height="12" rx="1" />
		</svg>
	);
};

export const medium = () => {
	return (
		<svg
			fill="#6B6F76"
			viewBox="0 0 16 16"
			aria-label="Medium Priority"
			width={16}
			height={16}
		>
			<title>Icon</title>
			<rect x="1" y="8" width="3" height="6" rx="1" />
			<rect x="6" y="5" width="3" height="9" rx="1" />
			<rect x="11" y="2" width="3" height="12" rx="1" fillOpacity="0.4" />
		</svg>
	);
};

export const low = () => {
	return (
		<svg
			fill="#6B6F76"
			viewBox="0 0 16 16"
			aria-label="Low Priority"
			width={16}
			height={16}
		>
			<title>Icon</title>
			<rect x="1" y="8" width="3" height="6" rx="1" />
			<rect x="6" y="5" width="3" height="9" rx="1" fillOpacity="0.4" />
			<rect x="11" y="2" width="3" height="12" rx="1" fillOpacity="0.4" />
		</svg>
	);
};

export function inProgress() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Icon</title>
			<g clipPath="url(#clip0_1473_20025)">
				<circle cx="8" cy="8" r="7" stroke="#7394FF" strokeWidth="1.5" />
				<path
					d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1V15Z"
					fill="#7394FF"
				/>
			</g>
			<defs>
				<clipPath id="clip0_1473_20025">
					<rect width="16" height="16" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}

export function filterInProgress() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			fill="none"
			aria-label="In Progress"
			className="color-override"
			viewBox="0 0 14 14"
		>
			<title>Icon</title>
			<rect
				width="12"
				height="12"
				x="1"
				y="1"
				stroke="#F2C94C"
				strokeWidth="2"
				rx="6"
			/>
			<path fill="#F2C94C" d="M7 7V3.5a3.5 3.5 0 010 7z" />
		</svg>
	);
}

export const SqLogo = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 33 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>Icon</title>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M18.2665 17.0207C17.7999 17.836 17.5667 18.9517 17.5667 20.3678V21.3333H32.5V30.4C32.5 31.2837 31.7837 32 30.9 32H2.1C1.21634 32 0.5 31.2837 0.5 30.4V1.6C0.5 0.716345 1.21634 7.75419e-08 2.1 7.75419e-08L21.1712 0C21.1031 0.0402407 21.0361 0.08162 20.9702 0.124138C19.7403 0.896552 18.8708 1.85134 18.3619 2.98851C17.8529 4.10421 17.5985 5.24138 17.5985 6.4C17.5985 6.63602 17.6091 6.83985 17.6303 7.01149H21.9881C21.9669 6.81839 21.9563 6.52874 21.9563 6.14253C21.9563 5.75632 22.0836 5.30575 22.338 4.79081C22.5925 4.27586 22.9848 3.83601 23.515 3.47127C24.0663 3.08506 24.7555 2.89195 25.5826 2.89195C26.6005 2.89195 27.3639 3.19234 27.8728 3.7931C28.3818 4.37241 28.6362 5.059 28.6362 5.85287C28.6362 6.56092 28.4772 7.24751 28.1591 7.91264C27.8622 8.55632 27.3109 9.18927 26.505 9.81149L20.3023 14.7356C19.4328 15.4222 18.7542 16.1839 18.2665 17.0207ZM31.5058 0.88166C31.5252 0.900356 31.5444 0.919158 31.5635 0.938064C31.5445 0.919023 31.5253 0.900218 31.5058 0.88166ZM32.5 9.63422C32.014 10.4369 31.2881 11.247 30.3221 12.0644C28.9862 13.2015 27.3745 14.4889 25.4871 15.9264C25.2751 16.0981 25.01 16.3341 24.6919 16.6345C24.3738 16.9349 24.2148 17.128 24.2148 17.2138H32.5V9.63422Z"
			fill="#D8D8D8"
		/>
	</svg>
);

export const GithubIcon = () => (
	<svg
		viewBox="0 0 20 20"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		fill="#000000"
	>
		<g id="SVGRepo_bgCarrier" stroke-width="0" />
		<g
			id="SVGRepo_tracerCarrier"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<g id="SVGRepo_iconCarrier">
			{" "}
			<title>github [#142]</title> <desc>Created with Sketch.</desc>{" "}
			<defs> </defs>{" "}
			<g
				id="Page-1"
				stroke="none"
				stroke-width="1"
				fill="none"
				fill-rule="evenodd"
			>
				{" "}
				<g
					id="Dribbble-Light-Preview"
					transform="translate(-140.000000, -7559.000000)"
					fill="#000000"
				>
					{" "}
					<g id="icons" transform="translate(56.000000, 160.000000)">
						{" "}
						<path
							d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
							id="github-[#142]"
						>
							{" "}
						</path>{" "}
					</g>{" "}
				</g>{" "}
			</g>{" "}
		</g>
	</svg>
);
