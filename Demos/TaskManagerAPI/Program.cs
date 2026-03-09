using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Configure InMemory Database
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseInMemoryDatabase("TaskManagerList"));

// Configure CORS
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Seed initial data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    
    // Seed exactly the same 3 tasks as the React TaskContext.tsx
    if (!context.TaskItems.Any())
    {
        context.TaskItems.AddRange(
            new TaskItem
            {
                Id = 1,
                Title = "Set up GH repo",
                Description = "Initialize git repo, add .gitignore for react projects",
                Assignee = "Asmita",
                Status = "todo",
                Priority = "high"
            },
            new TaskItem
            {
                Id = 2,
                Title = "Design DB Schema",
                Description = "Draft ERD for user, task tables",
                Assignee = "Pavel",
                Status = "in-progress",
                Priority = "medium"
            },
            new TaskItem
            {
                Id = 3,
                Title = "Create homepage Figma mockup",
                Description = "Sketch simple wireframe for the landing view/page",
                Assignee = "Sammar",
                Status = "todo",
                Priority = "low"
            }
        );
        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Enable CORS using the policy we created
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
