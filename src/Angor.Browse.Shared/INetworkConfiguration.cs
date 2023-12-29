using Angor.Browse.Shared.Models;
using Blockcore.Networks;

namespace Angor.Browse.Shared;

public interface INetworkConfiguration
{
    Network GetNetwork();
    SettingsUrl GetIndexerUrl();
    SettingsUrl GetExplorerUrl();
    List<SettingsUrl> GetDefaultIndexerUrls();
    List<SettingsUrl> GetDefaultRelayUrls();
    List<SettingsUrl> GetDefaultExplorerUrl();
}