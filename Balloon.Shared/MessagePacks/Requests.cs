using MessagePack;

namespace Balloon.Shared.MessagePacks
{
    [MessagePackObject(true)]
    public class StartRequest
    {
        public double BetAmount { get; set; }
        public string CurrencyCode { get; set; }
    }
    
    [MessagePackObject(true)]
    public class UpdateRequest
    {
        public string TicketId { get; set; }
        public bool NeedToStop { get; set; }
    }
}