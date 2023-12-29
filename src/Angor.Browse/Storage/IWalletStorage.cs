using Angor.Browse.Shared.Models;

namespace Angor.Browse.Storage;

public interface IWalletStorage
{
    bool HasWallet();
    void SaveWalletWords(WalletWords walletWords);
    void DeleteWallet();
    WalletWords GetWallet();
}