using Angor.Browse.Shared.Services;
using Angor.Browse.Shared.Models;

namespace Angor.Browse.Shared.Services;


    public interface ICacheStorage
    {
        void StoreProjectInfo(ProjectInfo project);
        ProjectInfo? GetProjectById(string projectId);
        bool IsProjectInStorageById(string projectId);
        ProjectMetadata? GetProjectMetadataByPubkey(string pubkey);
        void StoreProjectMetadata(string pubkey, ProjectMetadata projectMetadata);
        bool IsProjectMetadataStorageByPubkey(string pubkey);
        List<ProjectIndexerData>? GetProjectIndexerData();
        void SetProjectIndexerData(List<ProjectIndexerData> list);
        List<UtxoData> GetUnconfirmedInboundFunds();
        List<Outpoint> GetUnconfirmedOutboundFunds();
        void SetUnconfirmedInboundFunds(List<UtxoData> unconfirmedInfo);
        void SetUnconfirmedOutboundFunds(List<Outpoint> unconfirmedInfo);

        void DeleteUnconfirmedInfo();
        void WipeSession();
    }

