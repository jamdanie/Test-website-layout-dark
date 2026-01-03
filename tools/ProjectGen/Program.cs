using System.Text.Json;
using System.Text.Json.Serialization;

var repoRoot = FindRepoRoot();
var dataDir = Path.Combine(repoRoot, "data");
var seedPath = Path.Combine(dataDir, "projects.seed.json");
var outPath  = Path.Combine(dataDir, "projects.json");

if (!File.Exists(seedPath))
{
    Console.Error.WriteLine($"Seed file not found: {seedPath}");
    Environment.Exit(1);
}

var json = await File.ReadAllTextAsync(seedPath);

var options = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true,
    WriteIndented = true,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
};

var seed = JsonSerializer.Deserialize<ProjectFile>(json, options) ?? new ProjectFile();

seed.Projects ??= new List<Project>();

// Normalize + clean
foreach (var p in seed.Projects)
{
    p.Title = (p.Title ?? "").Trim();
    p.Description = (p.Description ?? "").Trim();
    p.Tags ??= new List<string>();
    p.Tags = p.Tags.Select(t => (t ?? "").Trim()).Where(t => t.Length > 0).Distinct().ToList();
    p.Repo = (p.Repo ?? "").Trim();
    p.Live = (p.Live ?? "").Trim();
}

var output = new ProjectFile
{
    Projects = seed.Projects
        .OrderByDescending(p => p.Featured)
        .ThenBy(p => p.Title, StringComparer.OrdinalIgnoreCase)
        .ToList()
};

var outJson = JsonSerializer.Serialize(output, options);
Directory.CreateDirectory(dataDir);
await File.WriteAllTextAsync(outPath, outJson);

Console.WriteLine($"Wrote: {outPath}");

static string FindRepoRoot()
{
    var dir = Directory.GetCurrentDirectory();
    while (dir != null)
    {
        if (Directory.Exists(Path.Combine(dir, ".git")) || File.Exists(Path.Combine(dir, "index.html")))
            return dir;

        dir = Directory.GetParent(dir)?.FullName;
    }
    return Directory.GetCurrentDirectory();
}

public sealed class ProjectFile
{
    [JsonPropertyName("projects")]
    public List<Project>? Projects { get; set; }
}

public sealed class Project
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("tags")]
    public List<string>? Tags { get; set; }

    [JsonPropertyName("repo")]
    public string? Repo { get; set; }

    [JsonPropertyName("live")]
    public string? Live { get; set; }

    [JsonPropertyName("featured")]
    public bool Featured { get; set; }
}
