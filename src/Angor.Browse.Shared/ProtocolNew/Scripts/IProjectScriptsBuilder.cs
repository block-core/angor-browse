using Blockcore.Consensus.ScriptInfo;
using Blockcore.NBitcoin;

namespace Angor.Browse.Shared.ProtocolNew.Scripts;

public interface IProjectScriptsBuilder
{
    Script GetAngorFeeOutputScript(string angorKey);
    Script BuildInvestorInfoScript(string investorKey);
    Script BuildFounderInfoScript(string founderKey, string nostrPubKey);
    
    Script BuildSeederInfoScript(string investorKey, uint256 secretHash);
    
    (string investorKey, uint256? secretHash) GetInvestmentDataFromOpReturnScript(Script script);
}