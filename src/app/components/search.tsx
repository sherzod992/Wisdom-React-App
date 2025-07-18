import { styled } from "@mui/material/styles";
import {
  Box,
  InputBase,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

// Propsni qabul qiladigan interfeys
interface SearchBarProps {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

// Stil berilgan komponentlar
const Search = styled("div")(({ theme }) => ({
  borderRadius: "30px",
  backgroundColor: "white",
  width: "360px",
  boxShadow: "2px 2px 2px 1px grey",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  paddingLeft: theme.spacing(1),
}));

const SearchButton = styled("div")(({ theme }) => ({
  width: "45%",
  height: "100%",
  backgroundColor: "grey",
  borderRadius: "30px",
  padding: theme.spacing(0, 2),
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
    paddingLeft: theme.spacing(2),
    transition: theme.transitions.create("width"),
  },
}));

// Asosiy komponent
export default function SearchBar({
  searchText,
  setSearchText,
  onSearch,
}: SearchBarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Search>
        <StyledInputBase
          placeholder="Type here . . ."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch(); // Enter bosilsa qidiruv
          }}
          inputProps={{ "aria-label": "search" }}
          endAdornment={
            searchText && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchText("")} // X tugmasi
                  edge="end"
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            )
          }
        />
        <SearchButton>
          <IconButton onClick={onSearch}>
            <Typography>Search</Typography>
            <SearchIcon />
          </IconButton>
        </SearchButton>
      </Search>
    </Box>
  );
}
