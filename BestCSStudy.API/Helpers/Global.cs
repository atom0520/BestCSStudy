namespace BestCSStudy.API.Helpers
{
    public class Global
    {
        internal static object fin;

        public static int CountStringOccurrences(string text, string search){
            int pos = 0;
            int count = 0;
            int searchStart = 0;
            
            while (true) {
                pos = text.IndexOf(search, searchStart);
                if(pos == -1){
                    break;
                }
                count++;
                searchStart = pos+1;
            }

            return count;
        }
    }
}