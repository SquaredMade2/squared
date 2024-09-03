"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useSearchParams from "@/hooks/typeScriptReduxHooks";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import type { FormSubmitEvent, InputChangeEvent } from "@/types";
import { searchTasks } from "@/store/taskData/thunks";
import type { Task } from "@repo/db";
import TaskCard from "@/components/TaskCard";
import RenameModal from "@/components/RenameModal";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { PanelLeft, Search as SearchIcon } from "lucide-react";

const Search = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const [inputValue, setInputValue] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [taskData, setTaskData] = useState<Task | null>(null);
	const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
	const [filteredTasks, setFilteredTasks] = useState<Array<Task>>([]);
	const workspace = useAppSelector((state) => state.taskData.currentWorkspace);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showNavBar, setShowNavBar] = useState<boolean>(false);

	const workspaceUrl = `workspace/${workspace.url}`;

	const inputRef = useRef<HTMLInputElement>(null);
	const navbarRef = useRef<HTMLDivElement | null>(null);
	const { theme } = useSelector((state: RootState) => state.userSettings);

	const handleSubmit = async (e: FormSubmitEvent) => {
		e.preventDefault();
		setIsLoading(true);
		const params = new URLSearchParams(searchParams);
		if (inputValue.length === 0) {
			router.push(`workspace/${workspaceUrl}`);
		} else {
			params.set("query", inputValue);
			replace(`${pathname}?${params.toString()}`);
			setSearchQuery(inputValue);
			const searchedItems = await dispatch(
				searchTasks({ query: inputValue, workspace: workspace.id }),
			);
			setFilteredTasks(searchedItems.payload);
		}

		setIsLoading(false);
	};

	const handleChange = (e: InputChangeEvent) => {
		setInputValue(e.target.value.toLowerCase().trim());
	};

	const highlightText = (text: string) => {
		if (!searchQuery) return text;

		const words = text.split(" ");
		const parts: Array<React.ReactNode> = [];

		words.forEach((word, index) => {
			if (word.toLowerCase().includes(searchQuery.toLowerCase())) {
				const partsKey = `${word}-${index}`;
				parts.push(
					<span key={partsKey} className="bg-green-700">
						{word}
					</span>,
				);
			} else {
				parts.push(word);
			}

			if (index < words.length - 1) {
				parts.push(" ");
			}
		});

		return parts;
	};

	const handleNavToggle = (): void => {
		setShowNavBar(true);
	};

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		function handleClickAway(event: MouseEvent) {
			if (
				navbarRef.current &&
				event.target instanceof Node &&
				!navbarRef.current.contains(event.target)
			) {
				setShowNavBar(false);
			}
		}

		document.addEventListener("mousedown", handleClickAway);
		return () => {
			document.removeEventListener("mousedown", handleClickAway);
		};
	}, []);

	useEffect(() => {
		if (searchParams.get("query") !== searchQuery) {
			const fetchData = async () => {
				setSearchQuery(searchParams.get("query")?.toString() as string);
				const tasks = await dispatch(
					searchTasks({
						query: searchParams.get("query")?.toString() as string,
						workspace: workspace.id,
					}),
				);
				setFilteredTasks(tasks.payload);
			};
			fetchData();
		}
	}, [searchParams]);

	return (
		<div className="h-screen w-full bg-card flex">
			<div
				ref={navbarRef}
				className={`relative mdsm:absolute -left-0 transition-all duration-300 ease-in-out z-10 ${
					showNavBar ? "mdsm:-left-0" : "mdsm:-left-[500px]"
				}`}
			/>
			<div className="w-full flex flex-col items-center">
				<form onSubmit={handleSubmit} className="w-full flex relative">
					<div
						className="lg:hidden mdsm:visible absolute top-6 left-2 cursor-pointer"
						onClick={handleNavToggle}
					>
						{!showNavBar && <PanelLeft className="text-[#6B6F76] size-5" />}
					</div>
					<div className="flex items-relative mx-auto h-10 mt-3 w-11/12 xs:w-10/12 rounded bg-accent pl-10 relative text-foreground">
						<div className="absolute left-1 top-1 stroke-gray-500 fill-transparent cursor-pointer h-5 w-5">
							<SearchIcon className="text-[#999999]" />
						</div>
						<input
							type="text"
							ref={inputRef}
							name="search workspace"
							placeholder="Search..."
							autoComplete="off"
							className="w-full bg-accent focus:outline-none placeholder-gray-500 rounded"
							onChange={(e) => handleChange(e)}
						/>
					</div>
				</form>
				{!isLoading && (
					<>
						{taskData && (
							<RenameModal
								showRenameModal={showRenameModal}
								setShowRenameModal={setShowRenameModal}
								taskData={taskData}
								searchSubmit={handleSubmit}
							/>
						)}
						<div className="flex flex-col w-full border-t border-border mt-3">
							<TaskCard
								filteredTasks={filteredTasks}
								setShowRenameModal={setShowRenameModal}
								setTaskData={setTaskData}
								highlightText={highlightText}
								location="search"
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Search;
