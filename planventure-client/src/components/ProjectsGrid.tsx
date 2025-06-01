// ...existing imports...

export default function ProjectsGrid() {
  return (
    <div className="project-grid">
      {projects
        .filter(project => !project.documentationOnly)
        .map(project => (
          <SmallCarousel key={project.id} project={project} />
      ))}
    </div>
  );
}
