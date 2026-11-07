interface PageHeaderProps {
    title: string;
    description: string;
    className?: string;
}

export function PageHeader({ title, description, className = 'space-y-2' }: PageHeaderProps) {
    return (
        <header className={className}>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
        </header>
    );
}
