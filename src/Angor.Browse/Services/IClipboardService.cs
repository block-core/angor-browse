namespace Angor.Browse.Services
{
    public interface IClipboardService
    {
        Task<string> ReadTextAsync();
        Task WriteTextAsync(string text);
    }

}
