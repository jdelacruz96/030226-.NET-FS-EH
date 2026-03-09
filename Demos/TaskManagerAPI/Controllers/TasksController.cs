using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetTaskItems()
    {
        return await _context.TaskItems.ToListAsync();
    }

    // GET: api/Tasks/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetTaskItem(int id)
    {
        var taskItem = await _context.TaskItems.FindAsync(id);

        if (taskItem == null)
        {
            return NotFound();
        }

        return taskItem;
    }

    // PUT: api/Tasks/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTaskItem(int id, TaskItem taskItem)
    {
        if (id != taskItem.Id)
        {
            return BadRequest();
        }

        _context.Entry(taskItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TaskItemExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/Tasks
    [HttpPost]
    public async Task<ActionResult<TaskItem>> PostTaskItem(TaskItem taskItem)
    {
        _context.TaskItems.Add(taskItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTaskItem), new { id = taskItem.Id }, taskItem);
    }

    // DELETE: api/Tasks/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTaskItem(int id)
    {
        var taskItem = await _context.TaskItems.FindAsync(id);
        if (taskItem == null)
        {
            return NotFound();
        }

        _context.TaskItems.Remove(taskItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TaskItemExists(int id)
    {
        return _context.TaskItems.Any(e => e.Id == id);
    }
}
