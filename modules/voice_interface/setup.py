from setuptools import setup, find_packages
import os

with open('requirements.txt') as f:
    required = f.read().splitlines()

setup(
    name='interpart',
    entry_points = {
        'console_scripts' : [
            'interpart_voice_interface=interpart.main:run'
        ]
    },
    install_requires=required,
    packages=find_packages("."),
    python_requires='>=3.6'
)