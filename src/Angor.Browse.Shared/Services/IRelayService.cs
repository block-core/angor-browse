using Angor.Browse.Shared.Models;
using Nostr.Client.Messages;
using Nostr.Client.Messages.Metadata;
using Nostr.Client.Responses;

namespace Angor.Browse.Shared.Services;

public interface IRelayService
{
    void RegisterOKMessageHandler(string eventId, Action<NostrOkResponse> action);
    Task<string> AddProjectAsync(ProjectInfo project, string nsec);
    Task<string> CreateNostrProfileAsync(NostrMetadata metadata, string nsec);
    Task<string> DeleteProjectAsync(string eventId, string hexPrivateKey);
    void LookupProjectsInfoByPubKeys<T>(Action<T> responseDataAction, Action? OnEndOfStreamAction,
        params string[] nostrPubKey);
    void RequestProjectCreateEventsByPubKey(Action<NostrEvent> onResponseAction, Action? onEoseAction,params string[] nostrPubKeys);

    Task LookupDirectMessagesForPubKeyAsync(string nostrPubKey, DateTime? since, int? limit, Action<NostrEvent> onResponseAction);
    void CloseConnection();
}