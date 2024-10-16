import { Button } from "@/components/ui/button";

const RegistrationModal = ({
	setIsRegistered,
}: { setIsRegistered: React.Dispatch<React.SetStateAction<boolean>> }) => (
	<div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 z-50 w-full">
		<div className="w-full max-w-md shadow-lg dark:shadow-primary/5 bg-[#020a1c] border flex flex-col gap-4 p-12 rounded-lg">
			<h2 className="text-xl font-bold">Account created successfully.</h2>
			<p>Please check inbox to verify account.</p>
			<Button onClick={() => setIsRegistered(false)}>Close</Button>
		</div>
	</div>
);

export default RegistrationModal;
