using Angor.Browse.Shared.Models;

namespace Angor.Browse.Models;

public class FounderProject
{
    public ProjectMetadata? Metadata { get; set; }
    public ProjectInfo ProjectInfo { get; set; }
    public DateTime? LastRequestForSignaturesTime { get; set; }
}