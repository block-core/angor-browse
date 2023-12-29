using Angor.Browse.Shared.Models;

namespace Angor.Browse.Shared;

public interface INetworkStorage
{
    SettingsInfo GetSettings();
    void SetSettings(SettingsInfo settingsInfo);
}