using System.Collections.Generic;
using Balloon.Shared.DataModels;
using UnityEngine;

namespace Services
{
    [CreateAssetMenu(fileName = "UserTable", menuName = "ScriptableObjects/UserTable", order = 1)]
    public class UserTable : ScriptableObject
    {
        public List<UserInfo> users = new List<UserInfo>();
        
        private List<string> nicknames = new List<string>
        {
            "DreamWeaver", "StarShine", "MysticMuse", "OceanBreeze",
            "LunarLight", "SolarFlare", "TwilightSoul", "EchoWhisper",
            "SkyDancer", "ZenGarden", "SunflowerRay", "MoonlitPath",
            "FireHeart", "WhisperWind", "CelestialSage", "NorthernLights",
            "SerenitySeeker", "CosmicDust", "PhoenixRise", "SapphireDream",
            "VintageRose", "ForestNymph", "EternalVoyager", "MysticRiver",
            "StarryKnight", "WinterWolf", "SolarEclipse", "AutumnLeaf",
            "OceanVoyage", "ThunderSpirit", "MountainMystic", "DesertNomad",
            "RainbowMist", "ArcticFlame", "WildOrchid", "ZenithStar",
            "AuroraWhisper", "CrystalCave", "ShadowPhoenix", "SilverSage",
            "CoralReef", "MysticMountain", "GoldenSunrise", "ThunderHawk",
            "StormChaser", "OceanDepth", "SolarWind", "MoonGlow",
            "StarryAbyss", "NatureWhisper"
        };
        
        public void AddUser(UserInfo user)
        {
            users.Add(user);
        }
        
        public UserInfo GetUser(string username)
        {
            return users.Find(user => user.Username == username);
        }

        [ContextMenu("Create Dummy User")]
        public void CreateDummyUser()
        {
            foreach (var nickname in nicknames)
            {
                var user = new UserInfo(nickname,"123456");
                AddUser(user);
            }
        }
    }
}