using Nostr.Client.Client;

namespace Angor.Browse.Shared.Services;

public interface INostrCommunicationFactory
{
    INostrClient GetOrCreateClient(INetworkService networkService);
    void CloseClientConnection();
    int GetNumberOfRelaysConnected();
}