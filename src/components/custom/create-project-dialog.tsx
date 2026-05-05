import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import * as z from "zod";
import { Input } from "../ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "../ui/input-group";

export type Project = {
	projectName: string;
	projectDescription: string;
	projectStatus: string;
	projectOwner: string;
};

interface CreateProjectDialogProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const formSchema = z.object({
	projectName: z
		.string()
		.min(5, "Bug title must be at least 5 characters.")
		.max(32, "Bug title must be at most 32 characters."),
	projectDescription: z
		.string()
		.min(20, "Description must be at least 20 characters.")
		.max(200, "Description must be at most 100 characters."),
});

export function CreateProjectDialog({
	setProjects,
	open,
	setOpen,
}: CreateProjectDialogProps) {
	const form = useForm({
		defaultValues: {
			projectName: "",
			projectDescription: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			// Do something with form data
			console.log(value);
			setProjects((prev) => [
				...prev,
				{
					projectName: value.projectName,
					projectDescription: value.projectDescription,
					projectStatus: "planned",
					projectOwner: "me",
				},
			]);
			setOpen(false);
			form.reset();
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						setOpen(true);
					}}
					className="bg-blue-600 hover:bg-blue-700 p-1 text-white"
				>
					<Plus />
					<span>Create Project</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Create a project</DialogTitle>
					<DialogDescription>
						Create a new project to organize issues, track progress, and
						collaborate with your team.
					</DialogDescription>
				</DialogHeader>
				<form
					id="create-project-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field
							name="projectName"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Project name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Project name"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="projectDescription"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Project description
										</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Project description"
												rows={6}
												className="min-h-24 resize-none"
												aria-invalid={isInvalid}
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="tabular-nums">
													{field.state.value.length}/200 characters
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										<FieldDescription>
											Create a new project to organize issues, track progress,
											and collaborate with your team.
										</FieldDescription>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						></form.Field>
					</FieldGroup>
				</form>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button type="submit" form="create-project-form">
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
