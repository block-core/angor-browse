using Angor.Browse.Shared.Models;

namespace Angor.Browse.Shared.Services;

public interface ISignService
{
    DateTime RequestInvestmentSigs(SignRecoveryRequest signRecoveryRequest);
    void LookupSignatureForInvestmentRequest(string investorNostrPubKey, string projectNostrPubKey, DateTime sigRequestSentTime, Func<string, Task> action);

    Task LookupInvestmentRequestsAsync(string nostrPubKey, DateTime? since, Action<string, string, DateTime> action,
        Action onAllMessagesReceived);

    DateTime SendSignaturesToInvestor(string encryptedSignatureInfo, string nostrPrivateKey,
        string investorNostrPubKey);
        
    void CloseConnection(); //TODO call close connection from the pages
}