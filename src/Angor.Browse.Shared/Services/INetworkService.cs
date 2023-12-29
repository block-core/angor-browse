using Angor.Browse.Shared.Models;

namespace Angor.Browse.Shared.Services;

public interface INetworkService
{
    Task CheckServices(bool force = false);
    void AddSettingsIfNotExist();
    SettingsUrl GetPrimaryIndexer();
    SettingsUrl GetPrimaryRelay();
    List<SettingsUrl> GetRelays();
    void CheckAndHandleError(HttpResponseMessage httpResponseMessage);
    void HandleException(Exception exception);
}