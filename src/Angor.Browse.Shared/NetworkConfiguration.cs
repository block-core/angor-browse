using Angor.Browse.Shared;
using Angor.Browse.Shared.Models;
using Angor.Browse.Shared.Networks;
using Blockcore.Networks;

namespace Angor.Browse.Shared;

public class NetworkConfiguration : INetworkConfiguration
{
    public static string AngorTestKey = "tpubD8JfN1evVWPoJmLgVg6Usq2HEW9tLqm6CyECAADnH5tyQosrL6NuhpL9X1cQCbSmndVrgLSGGdbRqLfUbE6cRqUbrHtDJgSyQEY2Uu7WwTL";

    public Network GetNetwork()
    {
        return new BitcoinSignet();
    }

    public SettingsUrl GetIndexerUrl()
    {
        // return new IndexerUrl{Symbol = "", Url = "http://10.22.156.65:9910/api"};
        //return new IndexerUrl { Symbol = "", Url = "http://207.180.254.78:9910/api" };
        return new SettingsUrl { Name = "", Url = "https://tbtc.indexer.angor.io/api" };
    }

    public SettingsUrl GetExplorerUrl()
    {
        //return new IndexerUrl { Symbol = "", Url = "http://10.22.156.65:9911/btc/explorer" };
        //return new IndexerUrl { Symbol = "", Url = "http://207.180.254.78:9911/btc/explorer" };
        return new SettingsUrl { Name = "", Url = "https://explorer.angor.io/btc/explorer" };
    }

    public List<SettingsUrl> GetDefaultIndexerUrls()
    {
        return new List<SettingsUrl>
        {
            new SettingsUrl { Name = "", Url = "https://tbtc.indexer.angor.io", IsPrimary = true },
        };
    }

    public List<SettingsUrl> GetDefaultRelayUrls()
    {
        return new List<SettingsUrl>
        {
            new SettingsUrl { Name = "", Url = "wss://relay.angor.io", IsPrimary = true },
        };
    }

    public List<SettingsUrl> GetDefaultExplorerUrl()
    {
        return new List<SettingsUrl>
        {
            new SettingsUrl { Name = "", Url = "https://explorer.angor.io/btc/explorer", IsPrimary = true },
        };
    }

    public static List<ProjectInfo> CreateFakeProjects()
    {
        return new List<ProjectInfo>
            {
                new ProjectInfo
                {
                    StartDate = DateTime.UtcNow,
                    PenaltyDays = 100,
                    ExpiryDate = DateTime.UtcNow,
                    TargetAmount = 300,
                    ProjectIdentifier = "angor" + Guid.NewGuid().ToString("N"),
                    Stages = new List<Stage>
                    {
                        new Stage { AmountToRelease = 10, ReleaseDate = DateTime.UtcNow.AddDays(1) },
                        new Stage { AmountToRelease = 30, ReleaseDate = DateTime.UtcNow.AddDays(2) },
                        new Stage { AmountToRelease = 60, ReleaseDate = DateTime.UtcNow.AddDays(3) },
                    }
                },
                new ProjectInfo
                {
                    StartDate = DateTime.UtcNow,
                    PenaltyDays = 100,
                    ExpiryDate = DateTime.UtcNow,
                    TargetAmount = 200,
                    ProjectIdentifier = "angor" + Guid.NewGuid().ToString("N"),
                    Stages = new List<Stage>
                    {
                        new Stage { AmountToRelease = 10, ReleaseDate = DateTime.UtcNow.AddDays(1) },
                        new Stage { AmountToRelease = 30, ReleaseDate = DateTime.UtcNow.AddDays(2) },
                        new Stage { AmountToRelease = 60, ReleaseDate = DateTime.UtcNow.AddDays(3) },
                    }
                },
                new ProjectInfo
                {
                    StartDate = DateTime.UtcNow,
                    PenaltyDays = 100,
                    ExpiryDate = DateTime.UtcNow,
                    TargetAmount = 100,
                    ProjectIdentifier = "angor" + Guid.NewGuid().ToString("N"),
                    Stages = new List<Stage>
                    {
                        new Stage { AmountToRelease = 10, ReleaseDate = DateTime.UtcNow.AddDays(1) },
                        new Stage { AmountToRelease = 30, ReleaseDate = DateTime.UtcNow.AddDays(2) },
                        new Stage { AmountToRelease = 60, ReleaseDate = DateTime.UtcNow.AddDays(3) },
                    }
                },
            };
    }
}