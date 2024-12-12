import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Label } from "@squared/db";
import { Ellipsis } from "lucide-react";

export const LabelItem = ({ label }: { label: Label }) => {
	return (
		<Card className="flex justify-between p-1 my-2">
			<CardHeader className="flex text-xl">
				<CardTitle>{label.name}</CardTitle>
				<CardDescription>{label.description}</CardDescription>
			</CardHeader>
			<CardFooter>
				<Ellipsis className="h-4 w-4" />
			</CardFooter>
		</Card>
	);
};
