import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ArticleMovementsList from '../components/ArticleMovementsList';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';


// Mock dependencies 
jest.mock('axios');
jest.mock('react-toastify');
jest.mock('../../images/sahar up.png', () => 'test-file-stub');


const mockArticleMovements = {
    articleMovements: [
        {
            CODE_ARTICLE: 'ART001',
            INTIT_ARTICLE: 'Test Article',
            RAYON_ARTICLE: 'Test Rayon',
            EMPLACEMENT_ART: 'Test Location',
            STOCK_PHYSIQUE: 100,
            MVT_NUMERO: '1',
            MVT_DATE: '2023-01-01',
            MVT_TYPE_DOC: 'DOC1',
            MVT_NUM_DOC: 'NUM001',
            MVT_QTE: 10,
            MVT_CHAMP_1: '0'
        }
    ],
    total: 1
};

describe('ArticleMovementsList', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockArticleMovements });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', () => {
        render(<ArticleMovementsList />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('renders article data after loading', async () => {
        render(<ArticleMovementsList />);

        await waitFor(() => {
            expect(screen.getByText('Test Article')).toBeInTheDocument();
            expect(screen.getByText('ART001')).toBeInTheDocument();
        });
    });

    test('handles search input', async () => {
        render(<ArticleMovementsList />);

        const searchInput = screen.getByPlaceholderText('Rechercher un article...');
        await userEvent.type(searchInput, 'test');

        expect(axios.get).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                params: expect.objectContaining({
                    searchTerm: 'test'
                })
            })
        );
    });

    test('handles movement validation', async () => {
        axios.put.mockResolvedValueOnce({ data: { success: true } });

        render(<ArticleMovementsList />);

        await waitFor(() => {
            expect(screen.getByText('Test Article')).toBeInTheDocument();
        });

        // Expand the card
        const expandButton = screen.getByTestId('KeyboardArrowDownIcon');
        fireEvent.click(expandButton);

        // Find and click the checkbox
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    MVT_NUMERO: '1',
                    MVT_CHAMP_1: '1'
                })
            );
            expect(toast.success).toHaveBeenCalledWith('Mouvement validé avec succès');
        });
    });

    test('handles print functionality', async () => {
        // Mock window.open
        const mockOpen = jest.fn();
        const mockWrite = jest.fn();
        const mockClose = jest.fn();

        global.window.open = mockOpen.mockReturnValue({
            document: {
                write: mockWrite,
                close: mockClose
            }
        });

        render(<ArticleMovementsList />);

        await waitFor(() => {
            expect(screen.getByText('Test Article')).toBeInTheDocument();
        });

        const printButton = screen.getByTestId('PrintIcon').closest('button');
        fireEvent.click(printButton);

        expect(mockOpen).toHaveBeenCalled();
        expect(mockWrite).toHaveBeenCalled();
        expect(mockClose).toHaveBeenCalled();
    });

    test('handles error during data fetching', async () => {
        axios.get.mockRejectedValueOnce(new Error('API Error'));

        render(<ArticleMovementsList />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Failed to fetch article movements. Please try again later.'
            );
        });
    });

    test('handles pagination', async () => {
        render(<ArticleMovementsList />);

        await waitFor(() => {
            expect(screen.getByText('Test Article')).toBeInTheDocument();
        });

        const nextPageButton = screen.getByTitle('Go to next page');
        fireEvent.click(nextPageButton);

        expect(axios.get).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                params: expect.objectContaining({
                    page: 1
                })
            })
        );
    });
});
