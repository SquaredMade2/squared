import Link from "next/link";
interface ContentBodyProps {
	page: any; // Or whatever you've got it saved as
	buttonText?: string;
  buttonLink?: string;
}

export default function ContentBody({page, buttonLink, buttonText}: ContentBodyProps) {
  return (
    <div>
      <h1>{page.title}</h1>
      {buttonText && buttonLink && (
        <Link href={buttonLink} className="button">
          {buttonText}
        </Link>
      )}
    </div>
  )
}